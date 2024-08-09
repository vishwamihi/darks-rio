const handleGetJidCommand = async (sock, from, message) => {
  try {
    // Extract the JID of the sender
    const senderJid = from;

    // Send the JID back to the user
    await sock.sendMessage(from, { text: `Your JID is: ${senderJid}` }, { quoted: message });
    console.log('JID response sent successfully.');
  } catch (error) {
    // Handle errors
    await sock.sendMessage(from, { text: 'Error retrieving JID.' }, { quoted: message });
    console.error('Error handling JID command:', error);
  }
};

module.exports = handleGetJidCommand;
