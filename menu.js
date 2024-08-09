const axios = require('axios');

const downloadImage = async (url, retries = 3) => {
  try {
    const response = await axios({
      url: url,
      responseType: 'arraybuffer',
      maxRedirects: 5,  // Adjust if necessary
      timeout: 10000,  // 10 seconds timeout
    });
    console.log('Image downloaded successfully.');
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error(`Failed to download image. Error: ${error.message}`);
    if (retries > 0) {
      console.warn(`Retrying download... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, 2000)); // Wait 2 seconds before retrying
      return downloadImage(url, retries - 1);
    } else {
      console.error('Failed to download image after retries:', error);
      throw error;
    }
  }
};

const handleMenu = async (sock, from, message) => {
  const menuContent = `╰─╴─★ ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ ★─╴──╯
╭──────────────────╮
  🔐 *ʙᴏᴛ ɴᴀᴍᴇ* : ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ
  👨‍💻 *ᴅᴇᴠᴇʟᴏᴘᴇʀꜱ* : ᴅᴀʀᴋ-ʀɪᴏ-ʙʀᴏᴛʜᴇʀꜱ
  💦 *ᴡᴏʀᴋᴛʏᴘᴇ* : public
  🎓 *ᴘʀᴇꜰɪx* : . 
  📞 *ɴᴜᴍʙᴇʀ* : 94702481115
  📡 *ᴘʟᴀᴛꜰᴏʀᴍᴇ* : Linux
╰──────────────────╯
> *ᴄᴇʏʟᴏɴ ʙᴇꜱᴛ ᴍᴜʟᴛɪ-ᴅᴇᴠɪᴄᴇ ᴡᴀ ʙᴏᴛ* 
> *🦜ᴅᴀʀᴋ-ʀɪᴏ-ᴍᴅ*
─────────────────────
╰─╴─★ ᴄᴏᴍᴍᴀɴᴅꜱ ★─╴──╯
1. *.alive* 
★ bot alive know.
2. *.ping* 
★ Check the bot's response time.
3. *.menu* 
★ Display this menu.
4. *.mq* 
★ Send a random motivational quote to inspire the user.
. *.contact* 
★ Contact us easily
─────────────────────

Feel free to reach out if you have any questions!

*💻FOLLOW US* : _https://whatsapp.com/channel/0029VaSaZd5CBtxGawmSph1k_`;

  const imageUrl = 'https://i.ibb.co/C26D2mF/ethix.jpg';

  try {
    const imageBuffer = await downloadImage(imageUrl);
    if (imageBuffer) {
      await sock.sendMessage(from, {
        image: imageBuffer,
        caption: menuContent,
        footer: 'Click the button below to view our channel.',
      }, { quoted: message });

      console.log('Image with menu caption sent successfully.');
    } else {
      await sock.sendMessage(from, { text: 'Failed to download image.' }, { quoted: message });
    }
  } catch (error) {
    console.error('Error sending image with menu caption:', error);
  }
};

module.exports = handleMenu;
