const handleNetworkScan = async (sock, from, message) => {
  console.log('Received message object:', message);

  // Check if message and message.body are defined
  if (!message || !message.message || !message.message.conversation) {
    console.error('Invalid message format:', message);
    await sock.sendMessage(from, { text: 'Invalid message format or empty body.' }, { quoted: message });
    return;
  }

  // Ensure message.body is a string
  const commandText = message.message.conversation;
  if (typeof commandText !== 'string') {
    console.error('Message body is not a string:', commandText);
    await sock.sendMessage(from, { text: 'Message body is not a string.' }, { quoted: message });
    return;
  }

  // Process command arguments
  const args = commandText.split(' ').slice(1);
  const host = args[0];

  if (!host) {
    await sock.sendMessage(from, { text: 'Please provide a host to scan.' }, { quoted: message });
    return;
  }

  // Example network scan logic
  // (Add your network scan logic here)

  const responseText = `Network scan result for ${host}.`; // Example response
  await sock.sendMessage(from, { text: responseText }, { quoted: message });
};

module.exports = handleNetworkScan;
