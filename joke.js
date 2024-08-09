const axios = require('axios');

const handleJoke = async (sock, from, message) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    const joke = response.data;
    await sock.sendMessage(from, { text: `*${joke.setup}*\n\n*${joke.punchline}*` }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(from, { text: 'Error retrieving joke.' }, { quoted: message });
  }
};

module.exports = handleJoke;
