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

const bannedWordsFile = 'bannedWords.txt';
const allMessagesFile = 'allMessages.txt';

// Create bannedWords.txt if it doesn't exist
if (!fs.existsSync(bannedWordsFile)) {
	fs.writeFileSync(bannedWordsFile, '');
}

const bannedWords = readTxtEntries(bannedWordsFile);

function addToBannedWordList(word) {
	bannedWords.push(word);
	fs.writeFileSync(bannedWordsFile, bannedWords.join('\n'));
}

function getCurrentHour() {
	return new Date().getHours();
}

let lastHourSent = getCurrentHour();

function readTxtEntries(fileName) {
	return fs.readFileSync(fileName, 'utf8').split('\n');
}

client.on("ready", () => {
	console.log("Bot is ready!");

	client.user.setPresence({
		activities: [{
			name: 'moth.Warze.org',
			type: ActivityType.Watching,
		}],
		status: 'dnd'
	});

	// Load all lines from allMessages.txt and filter out banned words
	let allMessages = readTxtEntries(allMessagesFile).filter(m => !bannedWords.includes(m));

	console.log(`Loaded ${allMessages.length} messages and ${bannedWords.length} banned words`);

	const channel = client.channels.cache.get(env.SEND_CHANNEL);

	// Send a random message from allMessages.txt whenever there is a new hour
	setInterval(() => {
		const hour = getCurrentHour();

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
