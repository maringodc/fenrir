import type {Event} from '../interfaces'
import {REST} from '@discordjs/rest'
import {Routes} from 'discord-api-types/v9'
import config from "../../config/config.json";
import {log} from "../utils/utils";

export default {
    name: 'clientReady',
    run: async (client) => {
        log("NOTE", "clientReady.ts", `Registering commands.`)

        const rest = new REST({
            version: '9',
        }).setToken(config.TOKEN);

        const command = client.commands.map((m) => m.data);
        const nodevCommand = client.nodevcommands.map((m) => m.data);

        await (async () => {
            try {
                if (process.env.STATUS === 'production') {
                } else {
                    for (const guildId of config.guildIds) {
                        await rest.put(Routes.applicationGuildCommands(config.clientId, guildId), {
                            body: nodevCommand,
                        })
                    }
                    await rest.put(Routes.applicationGuildCommands(config.clientId, config.devGuild), {
                        body: command,
                    })
                    log("SUCCESS", "clientReady.ts", `Registering commands was a success.`)
                }
            } catch (error) {
                log("ERROR", "clientReady.ts", `Unable to register commands: ${error}`)
            }
        })();

        log("SUCCESS", "clientReady.ts", `${client.user?.username} is ready to roar.`)
    },
} as Event