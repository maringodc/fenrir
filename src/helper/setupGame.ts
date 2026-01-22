import {
    ModalSubmitInteraction,
    Role,
    PermissionsBitField,
    ChannelType, BaseInteraction
} from "discord.js";
import {log} from "../utils/utils";
import {getRoles, RoleNames} from "./gameData";

const f = PermissionsBitField.Flags;
let roles: Role[] = [];

async function setupGame(interaction: ModalSubmitInteraction, number: string, title: string) {

    if (!interaction.guild) {
        log("ERROR", "setupGame.ts", `No guild found.`);
        return
    }

    const tempRoles = getRoles(interaction);

    if (tempRoles.length == 0) {
        log("ERROR", "setupGame.ts", `Something went wrong grabbing roles.`);
        return;
    }

    roles = tempRoles;

    log("NOTE", "setupGame.ts", `Setting up the game with title: ${title}`);

    // 4 Categories
    const mainCategory = await interaction.guild.channels.create({
        name: 'WW' + number + ' - ' + title,
        type: ChannelType.GuildCategory,
        permissionOverwrites: getCategoryPermissionsByType("TYPE_MAIN"),
    });

    const rolesCategory = await interaction.guild.channels.create({
        name: 'WW' + number + ' - Speciale Rollen',
        type: ChannelType.GuildCategory,
        permissionOverwrites: getCategoryPermissionsByType("TYPE_ROLES"),
    }).then();

    const bond1Category = await interaction.guild.channels.create({
        name: 'WW' + number + ' - Bondjes 1',
        type: ChannelType.GuildCategory,
        permissionOverwrites: getCategoryPermissionsByType("TYPE_BOND"),
    });

    const bond2Category = await interaction.guild.channels.create({
        name: 'WW' + number + ' - Bondjes 2',
        type: ChannelType.GuildCategory,
        permissionOverwrites: getCategoryPermissionsByType("TYPE_BOND"),
    });

    // Channels in Main Category
    const channelInschrijvingen = await interaction.guild.channels.create({
        name: 'Inschrijvingen',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_SIGNUP"),
    });

    const channelStembus = await interaction.guild.channels.create({
        name: 'Stembus',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_PLAY"),
    });

    const channelTactiek = await interaction.guild.channels.create({
        name: 'Tactiek',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_PLAY"),
    });

    const channelRP1 = await interaction.guild.channels.create({
        name: 'RP - 1',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_PLAY"),
    });

    const channelRP2 = await interaction.guild.channels.create({
        name: 'RP - 2',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_PLAY"),
    });

    const channelDodenrijk = await interaction.guild.channels.create({
        name: 'Dodenrijk',
        type: ChannelType.GuildText,
        parent: mainCategory.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_DOOD"),
    });

    // Both channels for Bondjes
    const channelBond1 = await interaction.guild.channels.create({
        name: 'Bondjes 1',
        type: ChannelType.GuildText,
        parent: bond1Category.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_BOND"),
    });

    const channelBond2 = await interaction.guild.channels.create({
        name: 'Bondjes 2',
        type: ChannelType.GuildText,
        parent: bond2Category.id,
        permissionOverwrites: getChannelPermissionsByType("CHANNEL_TYPE_BOND"),
    });

    log("SUCCESS", "setupGame.ts", `The game ${title} has been set up.`);

    return true;
}

function getCategoryPermissionsByType(type: string) {
    let permissions: ({ id: any; deny?: any[]; allow?: any[] })[] = []
    if (type === "TYPE_MAIN") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.Alive) permissions.push({id: role.id, allow: [f.ViewChannel, f.SendMessages]})
            if (role.name === RoleNames.Dead) permissions.push({id: role.id, deny: [f.SendMessages, f.SendMessagesInThreads]})
            if (role.name === RoleNames.Spectator) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages, f.SendMessagesInThreads]
            })
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages, f.SendMessagesInThreads]
            })
        }
    } else if (type === "TYPE_ROLES") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages, f.SendMessagesInThreads]
            })
        }
    } else if (type === "TYPE_BOND") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.Alive) permissions.push({
                id: role.id,
                allow: [f.SendMessages, f.ManageChannels, f.ManageRoles],
                deny: [f.ViewChannel,]
            })
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages, f.SendMessagesInThreads]
            })
        }
    }
    return permissions;
}

function getChannelPermissionsByType(type: string) {
    let permissions: ({ id: any; deny?: any[]; allow?: any[] })[] = []
    if (type === "CHANNEL_TYPE_SIGNUP") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.Alive) permissions.push({id: role.id, allow: [f.ViewChannel], deny: [f.SendMessages]})
            if (role.name === RoleNames.Dead) permissions.push({id: role.id, allow: [f.ViewChannel, f.SendMessages]})
            if (role.name === RoleNames.Spectator) permissions.push({id: role.id, allow: [f.ViewChannel, f.SendMessages]})
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.SendMessages]
            })
        }
    } else if (type === "CHANNEL_TYPE_PLAY") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.Alive) permissions.push({id: role.id, allow: [f.ViewChannel, f.SendMessages]})
            if (role.name === RoleNames.Dead) permissions.push({id: role.id, allow: [f.ViewChannel], deny: [f.SendMessages]})
            if (role.name === RoleNames.Spectator) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages]
            })
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages]
            })
        }
    } else if (type === "CHANNEL_TYPE_DOOD") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.Alive) permissions.push({id: role.id, deny: [f.ViewChannel]})
            if (role.name === RoleNames.Dead) permissions.push({id: role.id, allow: [f.ViewChannel, f.SendMessages]})
            if (role.name === RoleNames.Spectator) permissions.push({id: role.id, deny: [f.ViewChannel]})
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages]
            })
        }
    } else if (type === "CHANNEL_TYPE_BOND") {
        for (let role of roles) {
            if (role.name === RoleNames.Everyone) permissions.push({
                id: role.id,
                deny: [f.ViewChannel, f.CreatePrivateThreads]
            })
            if (role.name === RoleNames.DM) permissions.push({
                id: role.id,
                allow: [f.ViewChannel, f.ManageChannels, f.SendMessages, f.ManageMessages]
            })
            if (role.name === RoleNames.Alive) permissions.push({id: role.id, allow: [f.ViewChannel], deny: [f.SendMessages]})
            if (role.name === RoleNames.Dead) permissions.push({id: role.id, deny: [f.ViewChannel]})
            if (role.name === RoleNames.Spectator) permissions.push({id: role.id, deny: [f.ViewChannel]})
            if (role.name === RoleNames.BehindTheScenes) permissions.push({
                id: role.id,
                allow: [f.ViewChannel],
                deny: [f.SendMessages]
            })
        }
    }
    return permissions
}

export {
    setupGame
}