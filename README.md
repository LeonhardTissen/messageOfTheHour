# messageOfTheHour

## A Discord Bot that sends a message every hour to a specific channel.

### Install dependencies:
```
npm i
```

### Rename example.env to .env and fill in the required information:
```env
DISCORD_TOKEN=YourBotTokenHere
COLLECT_CHANNEL=123456789
SEND_CHANNEL=123456789
```

`DISCORD_TOKEN`: The bot token you get from the Discord Developer Portal.
`COLLECT_CHANNEL`: The channel ID where the bot should collect the messages from.
`SEND_CHANNEL`: The channel ID where the bot should send the messages to.

### Run the collection script once to collect the messages:
```
node messageCollector.js
```
This will collect the messages from the `COLLECT_CHANNEL` and save them to a file called `allMessages.txt`.
Doing this may take a while, depending on how many messages are in the channel.

### Run the bot script:
```
node main.js
```

### If you enjoy this bot, please leave a Star ⭐

<p align="center">
	<img src="https://s.warze.org/paddingleft3.png" style="display: inline-block;"><a href="https://twitter.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/x3.png" alt="Leonhard Tissen on X/Twitter" style="display: inline-block;"/></a><a href="https://youtube.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/youtube3.png" alt="Leonhard Tissen on YouTube" style="display: inline-block;"/></a><a href="https://linkedin.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/linkedin3.png" alt="Leonhard Tissen on LinkedIn" style="display: inline-block;"/></a><a href="https://github.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/github3.png" alt="Leonhard Tissen on GitHub" style="display: inline-block;"/></a><a href="https://gitlab.warze.org" style="text-decoration: none;"><img src="https://s.warze.org/gitlab3.png" alt="Leonhard Tissen on GitLab" style="display: inline-block;"/></a><img src="https://s.warze.org/paddingright2.png">
</p>
