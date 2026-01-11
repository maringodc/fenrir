const { REST, Routes } = require('discord.js');
const { clientId, guildIds, token } = require('./config.json');

const rest = new REST().setToken(token);

for (const index in guildIds) {
	rest.put(Routes.applicationGuildCommands(clientId, guildIds[index]), {body: []})
		.then(() => console.log('Successfully deleted all guild commands.'))
		.catch(console.error);
}