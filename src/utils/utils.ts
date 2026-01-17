import Discord from "discord.js";

const consoleColors = {
    "SUCCESS": "\u001b[32m",
    "WARNING": "\u001b[33m",
    "ERROR": "\u001b[31m",
    "NOTE": "\u001b[37m"
}

function missingPermissions(
    member: Discord.GuildMember,
    perms: Discord.PermissionResolvable
) {
    const missingPerms = member.permissions.missing(perms).map(
        (str) =>
            `\`${str
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
    );

    return missingPerms.length > 1
        ? `${missingPerms.slice(0, -1).join(", ")} and ${missingPerms.slice(-1)[0]}`
        : missingPerms[0];
}

function log(type: "SUCCESS" | "ERROR" | "WARNING" | "NOTE", path: string, text: string) {
    console.log(`\u001b[36;1m<Fenrir>\u001b[0m\u001b[34m [${path}]\u001b[0m - ${consoleColors[type]}${text}\u001b[0m`);
}

export {
    missingPermissions,
    log,
};