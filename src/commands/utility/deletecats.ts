import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	CategoryChannel,
	GuildMember,
	type CommandInteraction, type CacheType
} from "discord.js";
import {type Command, CommandNames} from "../../interfaces";
import config from "../../../config/config.json";

const commandName = CommandNames.Deletecats;

export default {
    name: commandName,
	data: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription('Delete WW categories')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	guildId: config.devGuild,
	run: async (interaction: CommandInteraction<CacheType>)=> {
		if (!interaction.inGuild() || !interaction.guild) return
		if(interaction.isCommand()) {
			if (!interaction.member) {
				await interaction.reply({content: "Not enough permissions"});
				return
			}
			// For me only.
			if (interaction.member instanceof GuildMember && interaction.member.id === config.devId) {
				await interaction.reply({content: "Deleting WW categories"});
				const guild = interaction.guild;
				const cats = guild.channels.cache.filter(CategoryChannel => CategoryChannel.parentId === null);

				cats.each((cat) => {
					if (cat instanceof CategoryChannel) {
						if (cat.name.slice(0, 2) === "WW") {
							cat.children.cache.each(child => {
								guild.channels.delete(child.id);
							});
							guild.channels.delete(cat.id);
						}
					}
				});

				await interaction.followUp("Done.");
			} else {
				await interaction.followUp({content: "Not enough permissions"});
			}
		}
	},
} as Command;
