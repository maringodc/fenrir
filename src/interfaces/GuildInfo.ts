import Discord from "discord.js";

export interface GuildInfo {
    /** This guilds prefix for the bot */
    prefix: string;

    /** Array with all channel ID's that are disabled */
    disabledChannels: Discord.Snowflake[];

    /** Contains all the custom command permissions for a command */
    //commandPerms?: { [name: string]: Discord.PermissionString[] };
}