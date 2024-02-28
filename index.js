const { fetchJson, range, parseMarkdown } = require('./lib/function')
const { Telegraf, Context } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const chalk = require('chalk')
const os = require('os')
const fs = require('fs')
const ytdl = require('ytdl-core');
const axios = require('axios');
const path = require('path');
const sadTexts = require('./sad');
const { apikey, bot_token, owner, ownerLink, version, prefix } = JSON.parse(fs.readFileSync(`./config.json`))
let entertainment = {}

if (bot_token == '') {
	return console.log('=== BOT TOKEN CANNOT BE EMPTY ===')
}

const bot = new Telegraf(bot_token)

bot.on('new_chat_members', async (lol) => {
	var message = lol.message
	var pp_group = await tele.getPhotoProfile(message.chat.id)
	var groupname = message.chat.title
	var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
	for (x of message.new_chat_members) {
		var pp_user = await tele.getPhotoProfile(x.id)
		var full_name = tele.getUser(x).full_name
		console.log(chalk.whiteBright('├'), chalk.cyanBright('[  JOINS  ]'), chalk.whiteBright(full_name), chalk.greenBright('join in'), chalk.whiteBright(groupname))
		await lol.replyWithPhoto({
			url: `https://api.lolhuman.xyz/api/base/welcome?apikey=${apikey}&img1=${pp_user}&img2=${pp_group}&background=https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg&username=${full_name}&member=${groupmembers}&groupname=${groupname}`,
		})
	}
})

bot.on('left_chat_member', async (lol) => {
	var message = lol.message
	var pp_group = await tele.getPhotoProfile(message.chat.id)
	var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
	var pp_group = await tele.getPhotoProfile(message.chat.id)
	var groupname = message.chat.title
	var groupmembers = await bot.telegram.getChatMembersCount(message.chat.id)
	var pp_user = await tele.getPhotoProfile(message.left_chat_member.id)
	var full_name = tele.getUser(message.left_chat_member).full_name
	console.log(chalk.whiteBright('├'), chalk.cyanBright('[  LEAVE  ]'), chalk.whiteBright(full_name), chalk.greenBright('leave from'), chalk.whiteBright(groupname))
	await lol.replyWithPhoto({ url: `https://api.lolhuman.xyz/api/base/leave?apikey=${apikey}&img1=${pp_user}&img2=${pp_group}&background=https://i.ibb.co/8B6Q84n/LTqHsfYS.jpg&username=${full_name}&member=${groupmembers}&groupname=${groupname}` })
})

bot.command('start', async (lol) => {
	user = tele.getUser(lol.message.from)
	await help.start(lol, user.full_name)
	await lol.deleteMessage()
})

bot.command('help', async (lol) => {
	user = tele.getUser(lol.message.from)
	await help.help(lol, user.full_name, lol.message.from.id.toString())
})

bot.on('callback_query', async (lol) => {
	cb_data = lol.callbackQuery.data.split('-')
	user_id = Number(cb_data[1])
	if (lol.callbackQuery.from.id != user_id) return lol.answerCbQuery('Sorry, You do not have the right to access this button.', { show_alert: true })
	callback_data = cb_data[0]
	user = tele.getUser(lol.callbackQuery.from)
	const isGroup = lol.chat.type.includes('group')
	const groupName = isGroup ? lol.chat.title : ''
	if (!isGroup) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ ACTIONS ]'), chalk.whiteBright(callback_data), chalk.greenBright('from'), chalk.whiteBright(user.full_name))
	if (isGroup) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ ACTIONS ]'), chalk.whiteBright(callback_data), chalk.greenBright('from'), chalk.whiteBright(user.full_name), chalk.greenBright('in'), chalk.whiteBright(groupName))
	if (callback_data == 'help') return await help[callback_data](lol, user.full_name, user_id)
	await help[callback_data](lol, user_id.toString())
})

bot.on('message', async (lol) => {
	try {
		const body = lol.message.text || lol.message.caption || ''
		comm = body.trim().split(' ').shift().toLowerCase()
		cmd = false
		if (prefix != '' && body.startsWith(prefix)) {
			cmd = true
			comm = body.slice(1).trim().split(' ').shift().toLowerCase()
		}
		const command = comm
		const args = await tele.getArgs(lol)
		const user = tele.getUser(lol.message.from)

		const reply = async (text) => {
			for (var x of range(0, text.length, 4096)) {
				return await lol.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
			}
		}

		if (entertainment[lol.update.message.from.id] && entertainment[lol.update.message.from.id] === lol.update.message.text.toLowerCase()) {
			delete entertainment[lol.update.message.from.id]
			return reply('Jawaban Anda benar.')
		}

		const isCmd = cmd
		const isGroup = lol.chat.type.includes('group')
		const groupName = isGroup ? lol.chat.title : ''

		const isImage = lol.message.hasOwnProperty('photo')
		const isVideo = lol.message.hasOwnProperty('video')
		const isAudio = lol.message.hasOwnProperty('audio')
		const isSticker = lol.message.hasOwnProperty('sticker')
		const isContact = lol.message.hasOwnProperty('contact')
		const isLocation = lol.message.hasOwnProperty('location')
		const isDocument = lol.message.hasOwnProperty('document')
		const isAnimation = lol.message.hasOwnProperty('animation')
		const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

		const quotedMessage = lol.message.reply_to_message || {}
		const isQuotedImage = quotedMessage.hasOwnProperty('photo')
		const isQuotedVideo = quotedMessage.hasOwnProperty('video')
		const isQuotedAudio = quotedMessage.hasOwnProperty('audio')
		const isQuotedSticker = quotedMessage.hasOwnProperty('sticker')
		const isQuotedContact = quotedMessage.hasOwnProperty('contact')
		const isQuotedLocation = quotedMessage.hasOwnProperty('location')
		const isQuotedDocument = quotedMessage.hasOwnProperty('document')
		const isQuotedAnimation = quotedMessage.hasOwnProperty('animation')
		const isQuoted = lol.message.hasOwnProperty('reply_to_message')

		var typeMessage = body.substr(0, 50).replace(/\n/g, '')
		if (isImage) typeMessage = 'Image'
		else if (isVideo) typeMessage = 'Video'
		else if (isAudio) typeMessage = 'Audio'
		else if (isSticker) typeMessage = 'Sticker'
		else if (isContact) typeMessage = 'Contact'
		else if (isLocation) typeMessage = 'Location'
		else if (isDocument) typeMessage = 'Document'
		else if (isAnimation) typeMessage = 'Animation'

		if (!isGroup && !isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ PRIVATE ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name))
		if (isGroup && !isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[  GROUP  ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name), chalk.greenBright('in'), chalk.whiteBright(groupName))
		if (!isGroup && isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ COMMAND ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name))
		if (isGroup && isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ COMMAND ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name), chalk.greenBright('in'), chalk.whiteBright(groupName))

		var file_id = ''
		if (isQuoted) {
			file_id = isQuotedImage
				? lol.message.reply_to_message.photo[lol.message.reply_to_message.photo.length - 1].file_id
				: isQuotedVideo
				? lol.message.reply_to_message.video.file_id
				: isQuotedAudio
				? lol.message.reply_to_message.audio.file_id
				: isQuotedDocument
				? lol.message.reply_to_message.document.file_id
				: isQuotedAnimation
				? lol.message.reply_to_message.animation.file_id
				: ''
		}
		var mediaLink = file_id != '' ? await tele.getLink(file_id) : ''

		switch (command) {
case 'help':
				await help.help(lol, user.full_name, lol.message.from.id.toString())
				break
case 'infogempa':
    try {
        if (args.length === 0) {
            const { data } = await axios.get(`https://api.lolhuman.xyz/api/infogempa?apikey=${apikey}`)
            const gempa = data.result           
            const caption = `
                Lokasi : ${gempa.lokasi}
                Waktu : ${gempa.waktu}
                Potensi : ${gempa.potensi}
                Magnitude : ${gempa.magnitude}
                Kedalaman : ${gempa.kedalaman}
                Koordinat : ${gempa.koordinat}
            `
            
            await lol.replyWithPhoto({ url: gempa.map }, { caption: caption.trim() })
        } else {
             return await reply('Perintah tidak valid. Perintah yang valid: /infogempa')
        }
    } catch (error) {
        console.error(error)
        return await reply('Terjadi kesalahan saat mengambil data gempa')
    }
    break;

	case 'owner': {
    result = await fetchJson(`https://api.lolhuman.xyz/api/quran?apikey=${apikey}`);
    result = result.result;
    text = '𝗕𝗘𝗥𝗜𝗞𝗨𝗧 𝗔𝗗𝗔𝗟𝗔𝗛 𝗢𝗪𝗡𝗘𝗥 𝗕𝗢𝗧\n\nMy Owner👑\n❑ @VLShop2\n❑ @keikoetsu';
    await reply(text);
    break;
}
case 'april':
case 'openai':
    if (args.length === 0) {
        return await reply(`Contoh: ${prefix + command} Siapa Puan Maharani`);
    }
    const query = encodeURIComponent(args.join(' '));
    const systemDescription = `Perkenalkan diri Anda... ${query}`;
    const apiKey = "pinott";  // Ganti dengan kunci API yang sebenarnya
    const apiUrl = `https://skizo.tech/api/openai?text=${systemDescription}&system=${systemDescription}&apikey=${apiKey}`;
    try {
        const response = await fetchJson(apiUrl);
        if (response.error) {
            return await reply("Error dalam memproses permintaan.");
        }
        const result = response.result;
        await reply(result);
    } catch (error) {
        console.error("Error dalam perintah AI:", error);
        return await reply("Terjadi kesalahan yang tidak terduga saat memproses permintaan.");
    }
    break;

case 'miku':
case 'aimiku':
    if (args.length === 0) {
        return await reply(`Contoh: ${prefix + command} Siapa Puan Maharani`);
    }
    const queryGPT = args.join(' ');
    const prompt = `Perkenalkan dirimu... ${queryGPT}`;
    try {
        const responseGPT = await fetch(`https://api-charaai.vercel.app/charaai?chara=Miku&text=${encodeURIComponent(prompt)}`);
        if (!responseGPT.ok) {
            throw new Error(`Gagal memproses permintaan: ${responseGPT.statusText}`);
        }
        const dataGPT = await responseGPT.json();
        const resultGPT = dataGPT.trim().replace(/\n/g, '-'); // Menghapus karakter \n
       await lol.reply(resultGPT);
    } catch (error) {
        console.error("Error dalam perintah AI:", error);
        await reply("Terjadi kesalahan saat memproses permintaan.");
    }
    break;

case 'tiktok':
				if (args.length == 0) return await reply(`Example: ${prefix + command} https://vt.tiktok.com/ZSwWCk5o/`)
				url = `https://api.lolhuman.xyz/api/tiktok2?apikey=${apikey}&url=${args[0]}`
				result = await fetchJson(url)
				await lol.replyWithVideo({ url: result.result })
				break
                
case 'instagram':
case 'ig':
    if (args.length == 0) 
        return reply(`Example: ${prefix + command} https://www.instagram.com/p/CU0MhPjBZO2/`);
    
    try {
        const url = encodeURIComponent(args[0]); // Memastikan URL aman untuk dimasukkan ke dalam URL permintaan
        const apiKey = 'GataDios'; // Ganti dengan API key yang diberikan
        const response = await fetchJson(`https://api.lolhuman.xyz/api/instagram?apikey=${apiKey}&url=${url}`);
        
        // Periksa apakah respons berhasil atau tidak
        if (!response.status) 
            throw new Error(response.message || "Unknown error occurred");
        
        const data = response.result;
        
        // Memastikan bahwa 'data' adalah array sebelum mencoba mengiterasinya
        if (!Array.isArray(data)) {
            throw new Error('Invalid response format');
        }
        
        for (let link of data) {
            if (link.includes('.mp4')) {
                await lol.replyWithVideo({ url: link });
            } else {
                await lol.replyWithPhoto({ url: link });
            }
        }
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        await reply('An error occurred while fetching Instagram data.');
    }
    break;

	case 'pinterest':
    if (args.length == 0) return await reply(`Example: ${prefix + command} loli kawaii`);
    try {
        const query = args.join(''); // Menggunakan const untuk mendeklarasikan variabel query
        const response = await fetch(`https://api.lolhuman.xyz/api/pinterest?apikey=${apikey}&query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        const url = data.result;
        await lol.replyWithPhoto({ url: url });
    } catch (error) {
        console.error(error);
        await reply('Failed to fetch Pinterest image.');
    }
    break;
case 'diffusion':
    if (args.length === 0) 
        return await reply(`Example: ${prefix + command} red car`);
    
    try {
        const text = args.join(' ');
        const apiKey = 'GataDios'; // Ganti dengan kunci API Anda
        
        const response = await fetch(`https://api.lolhuman.xyz/api/diffusion-prompt?apikey=${apiKey}&prompt=${encodeURIComponent(text)}`);
        
        if (!response.ok) 
            throw new Error(`HTTP error! status: ${response.status}`);
        
        // Mengambil data gambar sebagai array buffer
        const arrayBuffer = await response.arrayBuffer();
        
        // Mengonversi array buffer menjadi buffer
        const imageData = Buffer.from(arrayBuffer);
        
        // Mengirim gambar sebagai balasan
        await lol.replyWithPhoto({ source: imageData });
    } catch (error) {
        console.error(error);
        await reply('Failed to convert text to image.');
    }
    break;

case 'text2img':
    if (args.length === 0) return await reply(`Example: ${prefix + command} red car`);
    try {
        const text = args.join(' ');
        const apiKey = 'Sj55VP'; // Ganti dengan API key yang diberikan
        const response = await fetch(`https://api.alyachan.dev/api/text2img?text=${encodeURIComponent(text)}&apikey=${apiKey}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const imageData = await response.json();
        if (!imageData.status) throw new Error(imageData.data || "Unknown error occurred");
        const imageUrl = imageData.data.images.url; // Ambil URL gambar dari respons API
        await lol.replyWithPhoto({ url: imageUrl });
    } catch (error) {
        console.error(error);
        await reply('Failed to convert text to image.');
    }
    break;
case 'sadvibes':
    if (args.length == 0) {
        // Mengambil daftar file audio di direktori 'vn'
        const audioFiles = fs.readdirSync('./vn').filter(file => file.endsWith('.mp3'));

        if (audioFiles.length === 0) 
            return await lol.reply("Tidak ada file audio ditemukan.");
        
        // Memilih secara acak satu file audio
        const randomIndex = Math.floor(Math.random() * audioFiles.length);
        const randomAudioFile = audioFiles[randomIndex];

        // Memilih secara acak satu teks dari file sad.js
        const randomSadText = sadTexts[Math.floor(Math.random() * sadTexts.length)];

        await lol.replyWithAudio({ source: `vn/${randomAudioFile}` });

        // Menambahkan teks acak dan dua tombol di bawahnya
        await lol.reply(randomSadText, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Owner👑", url: "https://t.me/VLShop2" },
                        { text: "Made by", url: "https://www.instagram.com/xwbytech" }
                    ]
                ]
            }
        });
    }
    break;
case 'ytplay':
    if (args.length == 0) return await reply(`Contoh: ${prefix + command} melukis senja`);
    try {
        const searchResult = await fetchJson(`https://api.lolhuman.xyz/api/ytsearch?apikey=${apikey}&query=${encodeURIComponent(args.join(' '))}`);
        if (searchResult.result.length === 0) return await reply("Maaf, saya tidak bisa menemukan video yang sesuai dengan permintaan Anda.");
        
        const videoId = searchResult.result[0].videoId;
        const playResult = await fetchJson(`https://api.lolhuman.xyz/api/ytplay2?apikey=${apikey}&url=https://www.youtube.com/watch?v=${videoId}`);
        
        if (!playResult.result || typeof playResult.result.link !== 'string') return await reply("Maaf, saya tidak bisa memutar video yang dimaksud.");
        
        // Pastikan URL audio yang Anda kirim adalah URL yang lengkap dan absolut
        const audioUrl = playResult.result.link.startsWith('http') ? playResult.result.link : `https:${playResult.result.link}`;
        
        await lol.replyWithAudio({ url: audioUrl, filename: playResult.result.title }, { thumb: playResult.result.thumbnail });
    } catch (error) {
        console.error("Error saat memutar video YouTube:", error);
        await reply("Maaf, terjadi kesalahan saat memutar video YouTube.");
    }
    break;
case 'translate':
    if (args.length === 0) 
        return await reply(`masukan text?.. bot akan mendeteksi bahasa secara otomatis kedalam bahasa indonesia`);
    
    const textToTranslate = args.join(' '); // Gabungkan sisa args menjadi satu string

    try {
        const response = await fetch(`https://api.lolhuman.xyz/api/translate/auto/id?apikey=GataDios&text=${encodeURIComponent(textToTranslate)}`);
        
        if (!response.ok) {
            throw new Error(`Terjadi kesalahan saat mengambil respons dari API: ${response.statusText}`);
        }
        
        const translationData = await response.json();
        console.log(translationData); // Print respons API untuk pemeriksaan

        if (translationData.status === 200 && translationData.message === 'success') {
            await reply(`Teks asli: ${translationData.result.original}\n\nTerjemahan: ${translationData.result.translated}`);
        } else {
            throw new Error(`Terjadi kesalahan saat menerjemahkan teks: ${translationData.message}`);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        await reply('Maaf, terjadi kesalahan saat melakukan translasi.');
    }
    break;
case 'hd':
    if (!message.photo || message.photo.length === 0)
        return await reply('Maaf, tolong kirimkan sebuah gambar.');
    
    // Ambil ID foto dengan kualitas terbaik
    const photo = message.photo.pop();
    const photoId = photo.file_id;

    try {
        const response = await fetch(`https://api.lolhuman.xyz/api/upscale?apikey=GataDios&img=${photoId}`);
        
        if (!response.ok) {
            throw new Error(`Terjadi kesalahan saat mengambil respons dari API: ${response.statusText}`);
        }
        
        const imageData = await response.json();
        console.log(imageData); // Print respons API untuk pemeriksaan

        if (imageData.status === 200 && imageData.result) {
            // Kirim foto yang telah diperbesar
            await replyWithPhoto({ url: imageData.result });
        } else {
            throw new Error(`Terjadi kesalahan saat memperbesar gambar: ${imageData.message}`);
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        await reply('Maaf, terjadi kesalahan saat memperbesar gambar.');
    }
    break;

case 'zodiac':
    // Memeriksa apakah pengguna memberikan zodiak sebagai argumen
    if (args.length === 0) {
        await reply('Maaf, tolong berikan zodiak yang Anda ingin ketahui.');
    } else {
        const zodiacSign = args[0].toLowerCase(); // Mendapatkan zodiak yang diberikan oleh pengguna
        const apiUrl = `https://api.lolhuman.xyz/api/zodiak/${zodiacSign}?apikey=GataDios`;

        try {
            // Mengambil data dari API untuk zodiak yang diberikan
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Terjadi kesalahan saat mengambil respons dari API: ${response.statusText}`);
            }

            const zodiacData = await response.json();

            // Memeriksa apakah data zodiak berhasil diperoleh dari API
            if (zodiacData.error) {
                throw new Error(`Zodiak tidak valid atau terjadi kesalahan: ${zodiacData.error}`);
            }

            // Kirim informasi zodiak kepada pengguna
            await reply(`Informasi Zodiak ${zodiacData.result.zodiak}:\n${zodiacData.result.keterangan}`);
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            await reply('Maaf, terjadi kesalahan saat memproses permintaan zodiak.');
        }
    }
    break;

			case 'test':
				test = await bot.telegram.getChatMembersCount(lol.message.chat.id)
				console.log(test)
				break
		}
	} catch (e) {
		console.log(chalk.whiteBright('├'), chalk.cyanBright('[  ERROR  ]'), chalk.redBright(e))
	}
})

bot.launch({
	dropPendingUpdates: true,
})
bot.telegram.getMe().then((getme) => {
	itsPrefix = prefix != '' ? prefix : 'No Prefix'
	console.log(chalk.greenBright(' ===================================================='))
	console.log(chalk.greenBright(' │ + Owner    : ' + owner || ''))
	console.log(chalk.greenBright(' │ + Bot Name : ' + getme.first_name || ''))
	console.log(chalk.greenBright(' │ + Version  : ' + version || ''))
	console.log(chalk.greenBright(' │ + Host     : ' + os.hostname() || ''))
	console.log(chalk.greenBright(' │ + Platfrom : ' + os.platform() || ''))
	console.log(chalk.greenBright(' │ + Prefix   : ' + itsPrefix))
	console.log(chalk.greenBright(' ===================================================='))
	console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))