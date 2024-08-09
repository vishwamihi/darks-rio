const axios = require('axios');

const handleMeme = async (sock, from, message) => {
  try {
    const response = await axios.get('https://meme-api.com/gimme');
    const meme = response.data;
    await sock.sendMessage(from, { 
      text: meme.title,
      image: { url: meme.url }
    }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(from, { text: 'Error retrieving meme.' }, { quoted: message });
  }
};

module.exports = handleMeme;
