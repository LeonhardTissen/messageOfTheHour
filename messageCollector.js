const fetchAll = require('discord-fetch-all');
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message],
});
const fs = require('fs');
const { parse } = require('path');
const env = require('dotenv').config().parsed;

client.on("ready", async () => {
	console.log("Bot is ready!");

	const channelIds = env.COLLECT_CHANNEL.split(',').map(channelId => parseInt(channelId));

	let allMessages = [];

	for (let channelId of channelIds) {

		const channel = client.channels.cache.get(channelId);

		console.log(`Started collecting messages from #${channel.name} in ${channel.guild.name}. This may take from a few seconds to a few minutes depending on the amount of messages in the channel.`);
		
		const allChannelMessages = await fetchAll.messages(channel, {
			reverseArray: true, // Reverse the returned array
			userOnly: true, // Only return messages by users
			botOnly: false, // Only return messages by bots
			pinnedOnly: false, // Only returned pinned messages
		});

		allMessages = allMessages.concat(allChannelMessages);
	}

	const allMessageContents = allMessages.map(m => m.content.replaceAll('\n', '{NEWLINE}')).filter(m => m.length > 0);
	
	// Put all messages into a txt file
	fs.writeFileSync('allMessages.txt', allMessageContents.join('\n'));

	console.log(`Finished collecting messages. Saved ${allMessages.length} messages to allMessages.txt`);

	client.destroy();
});

client.login(env.DISCORD_TOKEN)
