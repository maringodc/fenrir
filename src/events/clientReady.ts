import type {Event} from '../interfaces'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import config from "../../config/config.json";

export default {
	name: 'clientReady',
	run: async (client) => {
		console.log(`Registering commands.`)
		console.log("-----------------------------------------------------")

		const rest = new REST({
			version: '9',
		}).setToken(config.TOKEN);

		const command = client.commands.map((m) => m.data)

		;await (async () => {
			try {
				if (process.env.STATUS === 'production') {
				} else {
					await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildIds.fenrir), {
						body: command,
					})
				}
			} catch (error) {
				console.log(error)
			}
		})();

		console.log(`${client.user?.username} is ready.`)
	},
} as Event