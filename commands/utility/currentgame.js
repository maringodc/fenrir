const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const gameData = require('../../helper/gamedata.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('currentgame')
		.setDescription('Informatie over het huidige spel')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const userdata = interaction.member;
		const isAdmin = userdata.roles.cache.some(role => role.name === 'Admin');


		const msg = '**Nummer**: ' + gameData.getNumber() + '\n' +
			'**Naam**: ' + gameData.getName() + '\n' +
			'**Spelers**: \n ' + gameData.getPlayersAsDiscordList();

		await interaction.reply({ content: msg });

		if (isAdmin) {
			const adminMsg = 'Rollen: \n ' + gameData.getRolesAsDiscordList();
			await interaction.followUp({ content: adminMsg, flags: MessageFlags.Ephemeral });
		}

	},
};