const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { devId } = require('./../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletecats')
		.setDescription('Delete WW cats')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {

		// For me only.
		if (interaction.member.id === devId) {
			await interaction.reply({ content: "Deleting WW categories" });

			const cats = interaction.guild.channels.cache.filter(CategoryChannel => CategoryChannel.parentId === null);

			cats.each(cat => {
				if (cat.name.slice(0, 2) === "WW") {
					cat.children.cache.each(child => {
						interaction.guild.channels.delete(child.id);
					});
					interaction.guild.channels.delete(cat.id);
				}
			});

			await interaction.followUp("Done.");
		} else {
			await interaction.reply({ content: "Not enough permissions" });
		}
	},
};