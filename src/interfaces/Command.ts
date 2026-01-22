import {type ButtonInteraction, CommandInteraction, type ModalSubmitInteraction, type Snowflake} from 'discord.js'

export type CommandRun = (interaction: CommandInteraction) => any
export type CommandOnModalSubmit = (interaction: ModalSubmitInteraction) => any
export type CommandButton = (interaction: ButtonInteraction) => any

export const CommandNames = {
    DeleteGame: "deletegame",
    DeleteCats: "deletecats",
    NewGame: "newgame",
    ServerInfo: "serverinfo",
    RoleToSpectator: "roletospectator",
} as const;

export interface Command {
    name: string
    data: any
    guildId: Snowflake
    run: CommandRun
    onModalSubmit?: CommandOnModalSubmit
    onButton?: CommandButton
}