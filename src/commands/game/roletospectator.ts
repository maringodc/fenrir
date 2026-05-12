import {
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import {type Command, CommandNames} from "../../interfaces";
import {getRoles, RoleNames} from "../../helper/gameData";

const commandName = CommandNames.RoleToSpectator;

export default {
    name: commandName,
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('Set everyone to Spectator Role')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const roles = getRoles(interaction);
            const guildMembers = await interaction.guild?.members?.fetch()
            if (guildMembers && roles.length > 0) {
                const roleAlive = roles.find(role => role.name === RoleNames.Alive)
                const roleDead = roles.find(role => role.name === RoleNames.Dead)
                const roleSpectator = roles.find(role => role.name === RoleNames.Spectator)
                const roleBTS = roles.find(role => role.name === RoleNames.BehindTheScenes)
                if (roleAlive && roleDead && roleSpectator && roleBTS) {
                    guildMembers.forEach((member) => {
                        if (!member.user.bot) {
                            if (member.roles.cache.some(role => role.id === roleAlive.id)) {
                                member.roles.remove(roleAlive.id)
                            }
                            if (member.roles.cache.some(role => role.id === roleDead.id)) {
                                member.roles.remove(roleDead.id)
                            }
                            if (member.roles.cache.some(role => role.id === roleBTS.id)) {
                                member.roles.remove(roleBTS.id)
                            }
                            if (!member.roles.cache.some(role => role.id === roleSpectator.id)) {
                                member.roles.add(roleSpectator.id)
                            }
                        }
                    });
                }
                await interaction.reply("Roles changed. *Note: Discord might need a minute to catch up.*");
            } else {
                await interaction.reply("Roles not changed, something went wrong")
            }
        }
    },
} as Command