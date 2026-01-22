import {BaseInteraction, Role} from "discord.js";
import {log} from "../utils/utils";

const RoleNames = {
    Everyone: "@everyone",
    DM: "DM",
    Alive: "Levend",
    Dead: "Dood",
    Spectator: "Toeschouwer",
    BehindTheScenes: "Achter de schermen",
}
const roleNameStrings: string[] = [
    RoleNames.DM,
    RoleNames.Alive,
    RoleNames.Dead,
    RoleNames.Spectator,
    RoleNames.BehindTheScenes
]
const roles: Role[] = [];

function getRoles(interaction: BaseInteraction): Role[] {
    if (!interaction.guild) return []
    roles.push(interaction.guild.roles.everyone)
    for (const roleName of roleNameStrings) {
        const tempRole: Role | undefined = interaction.guild.roles.cache.find(role => role.name === roleName);
        if (tempRole instanceof Role) {
            roles.push(tempRole)
        } else {
            log("ERROR", "setupGame.ts", `Can't find role: ${roleName}`)
            return []
        }
    }
    return roles
}

export {
    RoleNames,
    getRoles
}