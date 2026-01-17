import {
	LabelBuilder,
	ModalBuilder,
	type ModalData,
	SlashCommandBuilder,
	TextInputBuilder,
	TextInputStyle,
	ComponentType
} from 'discord.js';
import {type Command, CommandNames} from "../../interfaces";
import {setupGame} from "../../helper/setupGame";

const commandName = CommandNames.NewGame;

export default {
	name: commandName,
	data: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription('New Game!'),
	run: async (interaction) => {
		if (interaction.isChatInputCommand()) {

			// Create the modal
			const modal = new ModalBuilder()
				.setCustomId(commandName)
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
	},
	onModalSubmit: async (interaction) => {
		await interaction.deferReply();
		const gameNumber: ModalData = interaction.fields.getField("gameNumberInput");
		const gameTitle: ModalData = interaction.fields.getField("gameTitleInput");
		if(gameNumber.type === ComponentType.TextInput && gameTitle.type === ComponentType.TextInput) {
			const reply = await setupGame(
				interaction,
				gameNumber.value,
				gameTitle.value
			);
			if (reply) {
				await interaction.editReply({content: "De categorieën en kanalen zijn aangemaakt."})
			}
		}
	}
} as Command