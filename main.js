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
	
	// Load all lines from allMessages.txt
	const allMessages = fs.readFileSync('allMessages.txt', 'utf8').split('\n').map(m => m.replaceAll('{NEWLINE}', '\n'));

	const channel = client.channels.cache.get(env.SEND_CHANNEL);

	// Send a random message from allMessages.txt whenever there is a new hour
	setInterval(() => {
		const date = new Date();
		const hour = date.getHours();
		if (hour !== lastHourSent) {
			lastHourSent = hour;
			channel.send(choice(allMessages));
		}
	}, 1000);
});

client.login(env.DISCORD_TOKEN);
