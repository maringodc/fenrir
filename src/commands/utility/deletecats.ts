import type {Command} from "../../interfaces";
import {SlashCommandBuilder, PermissionFlagsBits, CategoryChannel, GuildMember} from "discord.js";
import config from "../../../config/config.json";

export default {
    name: 'deletecats',
	data: new SlashCommandBuilder()
		.setName('deletecats')
		.setDescription('Delete WW categories')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	guildId: config.devGuild,
	run: async (interaction)=> {
        if(!interaction.member || !interaction.guild){
            await interaction.reply({ content: "Not enough permissions" });
            return
        }
		// For me only.
		if (interaction.member instanceof GuildMember && interaction.member.id === config.devId) {
			await interaction.reply({ content: "Deleting WW categories" });

			const cats = interaction.guild.channels.cache.filter(CategoryChannel => CategoryChannel.parentId === null);

			cats.each((cat) => {
				if(cat instanceof CategoryChannel) {
					if (cat.name.slice(0, 2) === "WW") {
						cat.children.cache.each(child => {
							// @ts-ignore
							interaction.guild.channels.delete(child.id);
						});
						// @ts-ignore
						interaction.guild.channels.delete(cat.id);
					}
				}
			});

			await interaction.followUp("Done.");
		} else {
			await interaction.followUp({ content: "Not enough permissions" });
		}
	},
} as Command;
