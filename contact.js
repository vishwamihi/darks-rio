const contactCommand = async (sock, from, message) => {
  const contactContent = `╰─╴─★ ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ ★─╴──╯
╭──────────────────╮
  📞 *ᴄᴏɴᴛᴀᴄᴛ ᴜꜱ* :
  📧 Email: contact@darkriobot.com
  📱 WhatsApp: +94702481115

  Feel free to contact us for any support or inquiries!
╰──────────────────╯
`;

  try {
    await sock.sendMessage(from, { text: contactContent }, { quoted: message });
    console.log('Contact message sent successfully.');
  } catch (error) {
    console.error('Error sending contact message:', error);
  }
};

module.exports = contactCommand;
