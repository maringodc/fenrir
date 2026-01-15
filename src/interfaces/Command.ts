import { CommandInteraction } from 'discord.js'

export type CommandRun = (interaction: CommandInteraction) => any

export interface Command {
    name: string
    data: any
    run: CommandRun
}