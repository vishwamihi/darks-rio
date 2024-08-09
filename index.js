const { makeWASocket, useMultiFileAuthState, makeInMemoryStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const handlePing = require('./ping');
const axios = require('axios');
const menuCommand = require('./menu'); // Import the menuCommand function
const aliveCommand = require('./alive');
const contactCommand = require('./contact');
const handlePortScan = require('./portscan');
const handleNetworkScan = require('./networkscan');
const handlePasswordCheck = require('./passwordcheck');
const handleMotivationalQuote = require('./mq');
const handleJoke = require('./joke');
const handleTrivia = require('./Trivia');
const handlememe = require('./meme');
const handleGetJidCommand = require('./jid');

// Setup logger
const logger = pino({ level: 'info' });

// Specify the JID (WhatsApp ID) of the recipient for status messages
const statusRecipientJid = '94702481115@s.whatsapp.net'; // Replace with the actual JID

// Function to download the image from the URL
const downloadImage = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    console.error('Failed to download image:', error);
    return null;
  }
};

// Start the bot
const startBot = async () => {
  // Setup authentication state
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const store = makeInMemoryStore({});

  // Create WhatsApp socket
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger, // Added logger here
    getMessage: async (key) => {
      return { conversation: 'Hello!' };
    },
  });

  // Bind the store to the socket
  store.bind(sock.ev);

  // Handle credentials update
  sock.ev.on('creds.update', saveCreds);

  // Handle connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    const imageUrl = 'https://i.ibb.co/C26D2mF/ethix.jpg'; // Image URL

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error ? lastDisconnect.error.output?.statusCode !== 401 : true;
      if (shouldReconnect) {
        logger.info('Connection closed. Reconnecting...');
        const imageBuffer = await downloadImage(imageUrl);
        if (imageBuffer && statusRecipientJid) {
          try {
            await sock.sendMessage(statusRecipientJid, { 
              image: imageBuffer, 
              caption: '```DARK-RIO-MD IS OFFLINE```' 
            });
          } catch (error) {
            console.error('Failed to send offline message:', error);
          }
        }
        startBot(); // Reconnect if not logged out
      } else {
        logger.info('Connection closed. You are logged out.');
      }
    } else if (connection === 'open') {
      logger.info('Connected successfully.');
      const imageBuffer = await downloadImage(imageUrl);
      if (imageBuffer && statusRecipientJid) {
        try {
          await sock.sendMessage(statusRecipientJid, { 
            image: imageBuffer, 
            caption: '```DARK-RIO-MD IS ONLINE```' 
          });
        } catch (error) {
          console.error('Failed to send online message:', error);
        }
      }
    }
  });

  // Handle incoming messages
  sock.ev.on('messages.upsert', async (msg) => {
    const message = msg.messages[0];
    if (!message.message) return;

    const from = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text) {
      try {
        if (text.startsWith('.ping')) {
          await handlePing(sock, from, message);
        } else if (text.startsWith('.menu')) {
          await menuCommand(sock, from, message);
        } else if (text.startsWith('.alive')) {
          await aliveCommand(sock, from, message);
        } else if (text.startsWith('.contact')) {
          await contactCommand(sock, from, message);
          } else if (text.startsWith('.portscan')) {
            await handlePortScan(sock, from, message);
          } else if (text.startsWith('.nscan')) {
            await handleNetworkScan(sock, from, message);
          } else if (text.startsWith('.passcheck')) {
            await handlePasswordCheck(sock, from, message);
          
          } else if (text.startsWith('.mq')) {
            await handleMotivationalQuote(sock, from, message);
          } else if (text.startsWith('.joke')) {
            await handleJoke(sock, from, message);
          } else if (text.startsWith('.trivia')) {
            await handleTrivia(sock, from, message);
          } else if (text.startsWith('.meme')) {
            await handlememe(sock, from, message);
          } else if (text.startsWith('.jid')) {
            await handleGetJidCommand (sock, from, message);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    }
  });
};

// Start the bot
startBot();
