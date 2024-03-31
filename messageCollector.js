const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message],
});
const fs = require('fs');
const env = require('dotenv').config().parsed;

async function fetchMessages(channel, messageLimit) {
	let lastID = null;
	let messages = [];

	while (true) {
		const fetchedMessages = await channel.messages.fetch({
			limit: 100,
			...(lastID && { before: lastID })
		})

		if (fetchedMessages.size === 0 || messages.length >= messageLimit) {
			return messages.reverse().filter(msg => !msg.author.bot);
		}

		messages = messages.concat(Array.from(fetchedMessages.values()));
		lastID = fetchedMessages.lastKey();
	}
}

client.on("ready", async () => {
	console.log("Bot is ready!");

	const channelIds = JSON.parse(fs.readFileSync('collectChannels.json', 'utf8'));

	let allMessages = [];

	for (let channelId of Object.keys(channelIds)) {
		const messageLimit = channelIds[channelId];

		const channel = client.channels.cache.get(channelId);

		console.log(`Started collecting messages from #${channel.name} in ${channel.guild.name}. This may take from a few seconds to a few minutes depending on the amount of messages in the channel.`);

		const allChannelMessages = await fetchMessages(channel, messageLimit);

		console.log(`Finished collecting messages from #${channel.name} in ${channel.guild.name}. Found ${allChannelMessages.length} messages.`);

		allMessages = allMessages.concat(allChannelMessages);
	}

	const allMessageContents = allMessages.map(m => m.content.replaceAll('\n', '{NEWLINE}')).filter(m => m.length > 0);

	// Put all messages into a txt file
	fs.writeFileSync('allMessages.txt', allMessageContents.join('\n'));

	console.log(`Finished collecting messages. Saved ${allMessages.length} messages to allMessages.txt`);

	client.destroy();
});

client.login(env.DISCORD_TOKEN)
