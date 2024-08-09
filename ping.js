// ping.js

const handlePing = async (sock, from, message) => {
  const responseTime = new Date().toISOString();
  try {
    await sock.sendMessage(from, { text: `*Pong! ${responseTime}*` }, { quoted: message });
    console.log('Ping response sent successfully.');
  } catch (sendError) {
    console.error('Error sending ping response:', sendError);
  }
};

module.exports = handlePing;
