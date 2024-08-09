const axios = require('axios');

// Store the start time when the bot initializes
const startTime = Date.now();

const getUptime = () => {
  const uptimeMs = Date.now() - startTime;
  const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const getPlatform = () => {
  if (process.env.DYNO) return 'Heroku';
  if (process.env.REPL_ID) return 'Replit';
  if (process.env.VERCEL) return 'Vercel';
  return 'Unknown'; // Default value if no known environment variables are detected
};

const aliveCommand = async (sock, from, message) => {
  const platform = getPlatform();
  const runtime = getUptime(); // Get the bot's uptime

  const aliveContent = `
𝐈'𝐌 𝐀𝐋𝐖𝐀𝐘𝐒 𝐀𝐋𝐈𝐕𝐄 !

𝗛𝗲𝘆 𝗗𝗔𝗥𝗞-𝗥𝗜𝗢-𝗠𝗗 𝗶𝘀 𝗼𝗻 𝗮𝗹𝗶𝘃𝗲 𝗺𝗼𝗱𝗲🦜

📡 ᴘʟᴀᴛꜰᴏʀᴍᴇ     : ${platform}
⏳ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲      : ${runtime}
> 𝗧𝘆𝗽𝗲 .𝗺𝗲𝗻𝘂 𝘁𝗼 𝗴𝗲𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱 𝗹𝗶𝘀𝘁📃

"Amidst the complexity of technology, small developers find beauty in simplicity, crafting elegant solutions that make a big difference."

> 𝐃𝐀𝐑𝐊-𝐑𝐈𝐎-𝐁𝐑𝐎𝐓𝐇𝐄𝐑𝐒 </>🇱🇰
> 🦜ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ

*💻FOLLOW US* : _https://whatsapp.com/channel/0029VaSaZd5CBtxGawmSph1k_

`;

  try {
    // Send the audio message first
    await sock.sendMessage(from, {
      audio: { url: 'https://github.com/Sithuwa/SITHUWA-MD/raw/main/media/Alive.mp3' },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: message });

    // Send the text message after the audio
    await sock.sendMessage(from, {
      text: aliveContent,
      headerType: 1
    }, { quoted: message });

    console.log('Alive message and audio sent successfully.');
  } catch (error) {
    console.error('Error sending alive message or audio:', error);
  }
};

module.exports = aliveCommand;
