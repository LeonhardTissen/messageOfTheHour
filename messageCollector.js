const fetchAll = require('discord-fetch-all');
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: [Partials.Channel, Partials.Message],
});
const fs = require('fs');
const env = require('dotenv').config().parsed;

client.on("ready", async () => {
	console.log("Bot is ready!");

	const channel = client.channels.cache.get(env.COLLECT_CHANNEL);

	console.log(`Started collecting messages from #${channel.name} in ${channel.guild.name}. This may take from a few seconds to a few minutes depending on the amount of messages in the channel.`);
	
	// First parameter needs to be a discord.js channel object
	// Second parameter is a optional set of options.
	const allMessages = await fetchAll.messages(channel, {
		reverseArray: true, // Reverse the returned array
		userOnly: true, // Only return messages by users
		botOnly: false, // Only return messages by bots
		pinnedOnly: false, // Only returned pinned messages
	});

	const allMessageContents = allMessages.map(m => m.content.replaceAll('\n', '{NEWLINE}')).filter(m => m.length > 0);
	
	// Put all messages into a txt file
	fs.writeFileSync('allMessages.txt', allMessageContents.join('\n'));

	console.log(`Finished collecting messages. Saved ${allMessages.length} messages to allMessages.txt`);

	client.destroy();
});

client.login(env.DISCORD_TOKEN)
