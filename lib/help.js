const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));
const { Markup } = require('telegraf');

exports.start = async (lol, name) => {
  const text = `Halo ${name}!! Nama saya Vynaa AI - Saya adalah Bot Telegram multi fungsi! Klik /help untuk mengetahui lebih lanjut tentang cara menggunakan bot ini.

Bergabunglah dengan [channel saya](https://t.me/VynaaMD) untuk mendapatkan informasi tentang semua pembaruan terbaru.`;
  const photoUrl = 'https://telegra.ph/file/fad9fa63b10e516e47ca6.png';
  const audioPath = './vn/menu.mp3';

  await Promise.all([
    lol.replyWithPhoto(
      { url: photoUrl },
      {
        caption: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }
    ),
    lol.replyWithAudio({ source: audioPath })
  ]);
};


exports.help = async (lol, name, user_id) => {
    const text = `👋Hai kak ${name}
┌────◉
▧ prefix : [ / ]
▧ botname : Vynaa AI
▧ platfrom : linux
▧ Version : 1.1.0
▧ Ramadhan : 12 Maret 2024
▧ IdulFitri : 9 April 2024
└────◉`;
  const options = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'ALLMENU🐼', callback_data: 'movie-' + user_id },
                { text: 'GALAU🥀', callback_data: 'galau-' + user_id }
            ]
        ]
    }
};
    try {
        await lol.editMessageText(text, options);
    } catch (error) {
        await lol.reply(text, options);
    }
};

exports.movie = async (lol, user_id, name) => {
    const prefix = config.prefix;
    const text = `
┌────◉
▧ prefix : [ / ]
▧ botname : Vynaa AI
▧ platfrom : linux
▧ Version : 1.1.0
▧ Ramadhan : 12 Maret 2024
▧ IdulFitri : 9 April 2024
└────◉

┌────◉ Fitur AI
❏ ${prefix}openai
❏ ${prefix}april
❏ ${prefix}miku
❏ ${prefix}text2img
❏ ${prefix}diffusion
└────◉
┌────◉ Fitur Lainnya
❏ ${prefix}infogempa
❏ ${prefix}translate 
❏ ${prefix}pinterest
❏ ${prefix}tiktok 
❏ ${prefix}Instagram 
❏ ${prefix}zodiac <soon>
❏ ${prefix}hd <soon>
❏ ${prefix}simi <soon>
❏ ${prefix}play <soon>
└────◉`;
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back⬅️', callback_data: 'help-' + user_id },
                    { text: 'Web🌐', url: 'http://linkbio.co/VLShop' }
                ],
                [
                    { text: 'Owner👑', url: 'http://t.me/VLShop2' }
                ]
            ]
        }
    });
};
exports.galau = async (lol, user_id, name) => {
    const prefix = config.prefix;
    const text = `
┌────◉
▧ prefix : [ / ]
▧ botname : Vynaa AI
▧ platfrom : linux
▧ Version : 1.1.0
▧ Ramadhan : 12 Maret 2024
▧ IdulFitri : 9 April 2024
└────◉

┌────◉ Galau
❏ ${prefix}sadvibes
❏ ${prefix}longstext
└────◉`;
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back⬅️', callback_data: 'help-' + user_id },
                    { text: 'Web🌐', url: 'http://linkbio.co/VLShop' }
                ],
                [
                    { text: 'Owner👑', url: 'http://t.me/VLShop2' }
                ]
            ]
        }
    });
};

exports.messageError = async (lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: 'Markdown', disable_web_page_preview: true });
};