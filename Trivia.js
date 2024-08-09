const axios = require('axios');

const handleTrivia = async (sock, from, message) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
    const trivia = response.data.results[0];
    const triviaInfo = `
      Question: ${trivia.question}
      Options:
      1. ${trivia.correct_answer}
      2. ${trivia.incorrect_answers[0]}
      3. ${trivia.incorrect_answers[1]}
      4. ${trivia.incorrect_answers[2]}
    `;
    await sock.sendMessage(from, { text: triviaInfo }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(from, { text: 'Error retrieving trivia.' }, { quoted: message });
  }
};

module.exports = handleTrivia;
