const {SlashCommandBuilder, MessageFlags, PermissionFlagsBits} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletecats')
		.setDescription('Delete WW cats')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		const userdata = interaction.member;
		const isAdmin = userdata.roles.cache.some(role => role.name === 'Admin');

		if (isAdmin) {
			await interaction.reply({ content: "Deleting WW categories" });

			const cats = interaction.guild.channels.cache.filter(CategoryChannel => CategoryChannel.parentId === null);

			cats.each(cat => {
				if (cat.name.slice(0, 2) === "WW") {
					interaction.guild.channels.delete(cat.id);
				}
			});

			await interaction.followUp("Done.");
		} else {
			await interaction.reply({ content: "Not enough permissions" });
		}
	},
};