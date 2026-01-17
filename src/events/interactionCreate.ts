import {type Event, CommandNames} from '../interfaces';

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
            if (interaction.customId === CommandNames.NewGame) {
                const command = interaction.client.commands.get(CommandNames.NewGame);
                command.onModalSubmit(interaction);
            }
        } else if (interaction.isButton()) {
			const splitId = interaction.customId.split("-");
			if(splitId[0] === CommandNames.DeleteGame){
                const command = interaction.client.commands.get(CommandNames.DeleteGame);
                command.onButton(interaction);
			}
        }
        else {
            await interaction.reply({content: `Something went wrong`})
        }
    },
} as Event