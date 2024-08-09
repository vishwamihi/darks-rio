const { WAConnection } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to download an image from a URL
const downloadImage = async (url, outputPath, retries = 3) => {
  try {
    const response = await axios({
      url,
      responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(outputPath));
    return new Promise((resolve, reject) => {
      response.data.on('end', () => resolve());
      response.data.on('error', reject);
    });
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying download... (${retries} attempts left)`);
      return downloadImage(url, outputPath, retries - 1);
    } else {
      throw error;
    }
  }
};

// Command to get the profile picture
const getProfilePhoto = async (sock, from, message) => {
  try {
    if (!message.body) {
      await sock.sendMessage(from, { text: 'Message body is missing.' }, { quoted: message });
      return;
    }

    const args = message.body.split(' ');
    if (args.length < 2) {
      await sock.sendMessage(from, { text: 'Please provide a phone number.' }, { quoted: message });
      return;
    }

    const phoneNumber = args[1];
    const jid = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@s.whatsapp.net`;

    // Fetch the profile picture URL
    const profilePicUrl = await sock.profilePictureUrl(jid);

    if (!profilePicUrl) {
      await sock.sendMessage(from, { text: 'No profile picture found.' }, { quoted: message });
      return;
    }

    // Define path for temporary storage
    const imagePath = path.join(__dirname, 'profile_pic.jpg');

    // Download the profile picture with retry logic
    await downloadImage(profilePicUrl, imagePath);

    // Send the profile picture as an image
    await sock.sendMessage(from, {
      image: fs.readFileSync(imagePath),
      caption: `Profile picture of ${phoneNumber}`
    }, { quoted: message });

    // Cleanup: delete the temporary image file
    fs.unlinkSync(imagePath);

    console.log('Profile picture sent successfully.');
  } catch (error) {
    console.error('Error retrieving or sending the profile picture:', error);
    await sock.sendMessage(from, { text: 'An error occurred while retrieving or sending the profile picture.' }, { quoted: message });
  }
};

module.exports = getProfilePhoto;
