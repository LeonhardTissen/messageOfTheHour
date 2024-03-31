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

function getMsUntilNextHour() {
	const now = new Date();
	const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1);
	return nextHour - now;
}

function msToHours(ms) {
	return ms / 1000 / 60 / 60;
}

function hoursToMs(hours) {
	return hours * 60 * 60 * 1000;
}

function readTxtEntries(fileName) {
	return fs.readFileSync(fileName, 'utf8').split('\n');
}

// Load all lines from allMessages.txt and filter out banned words
let allMessages = readTxtEntries(allMessagesFile).filter(m => !bannedWords.includes(m));

let channel;

function sendMessage() {
	// Pick a random message to send
	const messageToSend = choice(allMessages).replaceAll('{NEWLINE}', '\n');
	console.log(`Sending message: ${messageToSend}`);

	// Send message
	if (channel) {
		channel.send(messageToSend);
	}

	// Add to banned words list
	allMessages = allMessages.filter(m => m !== messageToSend);
	addToBannedWordList(messageToSend);

	const totalTime = getMsUntilNextHour();

	console.log(`Sent message: ${messageToSend}, next message in ${msToHours(totalTime)} hours`);

	// Schedule next message
	setTimeout(sendMessage, totalTime)
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

	console.log(`Loaded ${allMessages.length} messages.`);

	channel = client.channels.cache.get(env.SEND_CHANNEL);

	const msUntilNextHour = getMsUntilNextHour();

	// Schedule first message
	console.log(`Next message in ${msToHours(msUntilNextHour)} hours`);
	setTimeout(sendMessage, msUntilNextHour);
});

client.login(env.DISCORD_TOKEN);
