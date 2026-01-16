import {CommandInteraction, type Snowflake} from 'discord.js'

export type CommandRun = (interaction: CommandInteraction) => any

export interface Command {
    name: string
    data: any
    guildId: Snowflake
    run: CommandRun
}