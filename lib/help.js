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
    const text = ` Hai ${name}👋
This is a free bot for everyone to use😳.
If you want to donate you can click the button below💕💞.
If there is an error please report it to Vynaa /owner😁.
I hope you like this bot🥰.
Greetings from Vynaa.

▧ prefix : [ / ]
▧ botname : Vynaa AI
▧ platfrom : linux
▧ Version : 1.1.0
▧ Ramadhan : 12 Maret 2024
▧ IdulFitri : 9 April 2024
`;
 const options = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: 'ALLMENU🐼', callback_data: 'movie-' + user_id },
                { text: 'GALAU🥀', callback_data: 'galau-' + user_id }
            ],
            [
                { text: 'DONASI💕', callback_data: 'donasi-' + user_id },
                { text: 'STORE🥀', callback_data: 'store-' + user_id }
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

┌────◉ AI MENU
❏ ${prefix}openai
❏ ${prefix}april
❏ ${prefix}miku
❏ ${prefix}text2img
❏ ${prefix}diffusion
└────◉
┌────◉ Fitur Group
❏ ${prefix}afk
❏ ${prefix}stopafk
❏ ${prefix}tagall
└────◉
┌────◉ Fitur Lainnya
❏ ${prefix}infogempa
❏ ${prefix}translate 
❏ ${prefix}pinterest
❏ ${prefix}tiktok 
❏ ${prefix}Instagram 
❏ ${prefix}zodiac
❏ ${prefix}simi <soon>
❏ ${prefix}play <soon>
└────◉
┌────◉ ISLAMI MENU
❏ ${prefix}jadwalsholat
❏ ${prefix}alquranaudio
❏ ${prefix}doaharian
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

┌────◉ GALAU BANG
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
exports.donasi = async (lol, user_id, name) => {
    const prefix = config.prefix;
    const text = `
┌────◉
▧ DANA : 082389924037 
▧ OVO : 082389924037
▧ GOPAY : 082389924037
▧ QRIS : telegra.ph/file/b166c669f8c52bf3cbbd7.jpg
▧ SAWERIA : saweria.co/Vynaabot
└────◉

Very Thanks for Your donation😁
`;
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
exports.store = async (lol, user_id, name) => {
    const prefix = config.prefix;
    const text = `
┌────◉
▧ prefix : [ ${prefix} ]
▧ botname : Vynaa AI
▧ platfrom : linux
▧ Version : 1.1.0
▧ Ramadhan : 12 Maret 2024
▧ IdulFitri : 9 April 2024
└────◉
┌────◉ STORE MENU
❏ ${prefix}panel
❏ ${prefix}sewabot
❏ ${prefix}vps
❏ ${prefix}biolink
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
