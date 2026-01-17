import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    SlashCommandBuilder,
} from 'discord.js';
import type {Command} from "../../interfaces";
import config from "../../../config/config.json";

const name = "deletegame";

export default {
    name: name,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription('Delete a game'),
    guildId: config.devGuild,
    run: async (interaction) => {
        console.log("Received deletegame Command")
        if (interaction.isChatInputCommand()) {
            const categoryChannels = interaction.guild?.channels?.cache?.filter((channel) => channel.type === ChannelType.GuildCategory);

            if(!categoryChannels) {
                await interaction.reply({ content: "Failed: Can't fetch categories" });
                return;
            }
            else {
                const games: string[] = []
                categoryChannels.each((cat) => {
                    if (cat.name.slice(0, 2) === "WW") {
                        const title = cat.name.split(" ")[0]
                        if(!games.includes(title)) {
                            games.push(title);
                        }
                    }
                });
                games.sort()
                const row = new ActionRowBuilder<ButtonBuilder>()
                for(const game of games.slice(0, 5)) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`deletegame-${game}`)
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
    }
} as Command