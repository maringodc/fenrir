import type {Event} from '../interfaces';
import {ButtonInteraction, type Channel, ChannelType, CommandInteraction, ModalSubmitInteraction} from 'discord.js'
import {setupGame} from '../helper/setupGame'
import type {TextInputModalData} from "discord.js/typings";

export default {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.inGuild()) return
        if (interaction.isCommand()) {

            const command = client.commands.get(interaction.commandName)

            if (!command) return

            try {
                await command?.run(interaction)
            } catch (err) {
                if (err) console.log(err)

                await interaction.reply({
                    content: 'An error occurred while executing interactionCreate command.',
                })
            }
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'newgame') {
                await interaction.deferReply();
                // @ts-ignore
                const gameNumber: TextInputModalData = interaction.fields.getField("gameNumberInput");
                // @ts-ignore
                const gameTitle: TextInputModalData = interaction.fields.getField("gameTitleInput");
                const reply = await setupGame(
                    interaction,
                    gameNumber.value,
                    gameTitle.value
                );
                if (reply) {
                    await interaction.editReply({content: "De categorieën en kanalen zijn aangemaakt."})
                }
            }
        } else if (interaction.isButton()) {
			const splitId = interaction.customId.split("-");
			if(splitId[0] === "deletegame"){
				await interaction.deferReply();
				const categoryChannels = interaction.guild?.channels?.cache?.filter((channel: Channel) => {
                    if(channel.type === ChannelType.GuildCategory) {
                        if (channel.name.slice(0, splitId[1].length) === splitId[1]) {
                            channel.children.cache.each(child => {
                                interaction.guild.channels.delete(child.id);
                            });
                            interaction.guild.channels.delete(channel.id);
                            return channel;
                        }
                    }
                    return false;
                });
                await interaction.editReply({content: `Er zijn ${categoryChannels.size} categorieën van Spel ${splitId[1]} is verwijderd.`})
                return;
			}
            await interaction.reply({content: `Something went wrong`})
        }
    },
} as Event