const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message],
});
const fs = require('fs');
const env = require('dotenv').config().parsed;

function choice(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

// Create bannedWords.txt if it doesn't exist
if (!fs.existsSync('bannedWords.txt')) {
	fs.writeFileSync('bannedWords.txt', '');
}

const bannedWords = fs.readFileSync('bannedWords.txt', 'utf8').split('\n');

function addToBannedWordList(word) {
	console.log('Adding word to banned list:', word);
	bannedWords.push(word);
	fs.writeFileSync('bannedWords.txt', bannedWords.join('\n'));
}

let lastHourSent = -1;

client.on("ready", () => {
	console.log("Bot is ready!");

	client.user.setPresence({ 
		activities: [{ 
			name: 'moth.Warze.org', 
			type: ActivityType.Watching,
		}], 
		status: 'dnd' 
	});

	// Load banned words
	const bannedWords = fs.readFileSync('bannedWords.txt', 'utf8')
		.split('\n');
	
	// Load all lines from allMessages.txt and filter out banned words
	const allMessages = fs.readFileSync('allMessages.txt', 'utf8')
		.split('\n')
		.filter(m => !bannedWords.some(bw => m.includes(bw)));

	const channel = client.channels.cache.get(env.SEND_CHANNEL);

	// Send a random message from allMessages.txt whenever there is a new hour
	setInterval(() => {
		const date = new Date();
		const hour = date.getHours();

		// Already sent a message this hour
		if (hour === lastHourSent) return;

		// Send a message
		const messageToSend = choice(allMessages).replaceAll('{NEWLINE}', '\n');
		channel.send(messageToSend);

		// Add to banned words list
		allMessages = allMessages.filter(m => m !== messageToSend);
		addToBannedWordList(messageToSend);

		lastHourSent = hour;
	}, 1000);
});

client.login(env.DISCORD_TOKEN);
