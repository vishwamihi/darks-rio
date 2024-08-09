const zxcvbn = require('zxcvbn');

const handlePasswordCheck = async (sock, from, message) => {
  try {
    // Ensure message and message.body are defined and are strings
    if (!message || typeof message.body !== 'string') {
      await sock.sendMessage(from, { text: 'Invalid message format.' }, { quoted: message });
      return;
    }

    // Extract the password from the message
    const args = message.body.split(' ').slice(1);
    const password = args.join(' ');

    if (!password) {
      await sock.sendMessage(from, { text: 'Please provide a password to check.' }, { quoted: message });
      return;
    }

    // Check the strength of the password
    const result = zxcvbn(password);
    const strength = result.score;

    // Determine strength text based on the score
    let strengthText;
    switch (strength) {
      case 0:
        strengthText = 'Very Weak';
        break;
      case 1:
        strengthText = 'Weak';
        break;
      case 2:
        strengthText = 'Moderate';
        break;
      case 3:
        strengthText = 'Strong';
        break;
      case 4:
        strengthText = 'Very Strong';
        break;
      default:
        strengthText = 'Unknown Strength';
    }

    // Send the strength result to the user
    await sock.sendMessage(from, { text: `Password strength: ${strengthText}` }, { quoted: message });
    console.log('Password check response sent successfully.');
  } catch (error) {
    console.error('Error handling password check:', error);
    await sock.sendMessage(from, { text: 'An error occurred while checking the password.' }, { quoted: message });
  }
};

module.exports = handlePasswordCheck;
