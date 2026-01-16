import {
	LabelBuilder,
	ModalBuilder,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import type {Command} from "../../interfaces";

const name = "newgame";

export default {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription('New Game!'),
	run: async (interaction) => {
		if (interaction.isChatInputCommand()) {

			// Create the modal
			const modal = new ModalBuilder()
				.setCustomId(name)
				.setTitle('Setup');

			const gameTitle = new LabelBuilder()
				.setLabel('Titel van het Spel?')
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId('gameTitleInput')
						.setPlaceholder('Op de Partyboat')
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
				)

			const gameNumber = new LabelBuilder()
				.setLabel('Nummer van het Spel?')
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId('gameNumberInput')
						.setPlaceholder('84')
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
				)

			modal.addLabelComponents(gameNumber, gameTitle)

			await interaction.showModal(modal);
		}
	}
} as Command