import type {Event} from '../interfaces';
import { CommandInteraction, ModalSubmitInteraction} from 'discord.js'
import { setupGame } from '../helper/setupGame'
import type {TextInputModalData} from "discord.js/typings";

export default {
	name: 'interactionCreate',
	run: async (client, interaction) => {
		console.log("Received InteractionCreate");
		if (!interaction.inGuild()) return
		if (interaction instanceof CommandInteraction) {

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
		}
		else if (interaction instanceof ModalSubmitInteraction){
			if(interaction.customId === 'newgame'){
				console.log("Got modal submit for newgame")
				// @ts-ignore
				const gameNumber: TextInputModalData = interaction.fields.getField("gameNumberInput");
				// @ts-ignore
				const gameTitle: TextInputModalData = interaction.fields.getField("gameNumberInput");
				console.log(interaction.fields.getField("gameTitleInput"));
				const reply = await setupGame(
					interaction,
					gameNumber.value,
					gameTitle.value
				);
				if(reply){
					await interaction.reply({content: "De categorieën en kanalen zijn aangemaakt."})
				}
			}
		}
	},
} as Event