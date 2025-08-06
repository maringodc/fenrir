const { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newgame')
		.setDescription('Nieuw spel opzetten!'),
	async execute(interaction) {
		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('newGameModal')
			.setTitle('Setup');

		const gameTitle = new TextInputBuilder()
			.setCustomId('gameTitle')
			.setLabel('Titel van het Spel?')
			.setPlaceholder('Op de Partyboat')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const gameNumber = new TextInputBuilder()
			.setCustomId('gameNumber')
			.setLabel('Nummer van het Spel?')
			.setPlaceholder('84')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const firstActionRow = new ActionRowBuilder().addComponents(gameNumber);
		const secondActionRow = new ActionRowBuilder().addComponents(gameTitle);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);
	},
};