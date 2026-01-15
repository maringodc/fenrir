import type {Event} from '../interfaces';
import { CommandInteraction, ModalSubmitInteraction} from 'discord.js'
import { setupGame } from '../helper/setupGame'

export default {
	name: 'interactionCreate',
	run: async (client, interaction) => {
		console.log("Received InteractionCreate");
		if (!interaction.inGuild()) return
		if (interaction instanceof CommandInteraction) {

			const command = client.commands.get(interaction.commandName)
			console.log("Command: ")
			console.log(interaction)
			console.log(interaction.commandName)
			console.log(command)

			if (!command) return

			try {
				await command?.run(interaction)
			} catch (err) {
				if (err) console.log(err)

				await interaction.reply({
					content: 'An error occurred while executing interactionCreate command.',
				})
			}
		}
		else if (interaction instanceof ModalSubmitInteraction){
			if(interaction.customId === 'newgame'){

			}
		}
	},
} as Event