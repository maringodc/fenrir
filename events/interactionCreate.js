const { Events, MessageFlags } = require('discord.js');
const setupGame = require('../helper/setupGame.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
 				else {
					await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
				}
			}
		}
		if (interaction.isModalSubmit()) {
			if (interaction.customId === 'newGameModal') {
				const gameTitle = interaction.fields.getTextInputValue('gameTitle');
				const gameNumber = interaction.fields.getTextInputValue('gameNumber');
				console.log({ gameTitle, gameNumber });
				await interaction.reply({ content: 'Your game will be created. /n Gametitle: ' + gameTitle });
				await setupGame.setupGame(interaction, gameTitle, gameNumber);
			}
		}
	},
};