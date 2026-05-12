import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type Channel,
    ChannelType, PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js';
import {type Command, CommandNames} from "../../interfaces";
import config from "../../../config/config.json";

const commandName = CommandNames.DeleteGame;

export default {
    name: commandName,
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('Delete a game')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const categoryChannels = interaction.guild?.channels?.cache?.filter((channel) => channel.type === ChannelType.GuildCategory);

            if (!categoryChannels) {
                await interaction.reply({content: "Failed: Can't fetch categories"});
                return;
            } else {
                const games: string[] = []
                categoryChannels.each((cat) => {
                    if (cat.name.slice(0, 2) === "WW") {
                        const title = cat.name.split(" ")[0]
                        if (!games.includes(title)) {
                            games.push(title);
                        }
                    }
                });
                games.sort()
                const row = new ActionRowBuilder<ButtonBuilder>()
                for (const game of games.slice(0, 5)) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${commandName}-${game}`)
                            .setLabel(game)
                            .setStyle(ButtonStyle.Primary)
                    )
                }
                await interaction.reply({
                    content: "Welke game wil je verwijderen?",
                    components: [row],
                });
            }
        }
    },
    onButton: async (interaction) => {
        await interaction.deferReply();
        if (interaction.guild) {
            const splitId = interaction.customId.split("-");
            const guild = interaction.guild;
            const categoryChannels = guild.channels?.cache?.filter((channel: Channel) => {
                if (channel.type === ChannelType.GuildCategory) {
                    if (channel.name.slice(0, splitId[1].length) === splitId[1]) {
                        channel.children.cache.each(child => {
                            guild.channels.delete(child.id);
                        });
                        guild.channels.delete(channel.id);
                        return channel;
                    }
                }
                return false;
            });
            await interaction.editReply({content: `Er zijn ${categoryChannels.size} categorieën van Spel ${splitId[1]} is verwijderd.`})
            return;
        }
    }
} as Command