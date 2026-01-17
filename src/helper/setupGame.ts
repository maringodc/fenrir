import {
	ModalSubmitInteraction,
	Role,
	PermissionsBitField,
	ChannelType
} from "discord.js";
import {log} from "../utils/utils";

const f = PermissionsBitField.Flags;
const roleNames: string[] = ["DM","Levend","Dood","Toeschouwer","Achter de schermen"]
const roles: Role[] = [];

async function setupGame(interaction: ModalSubmitInteraction, number: string, title: string) {

	if(!interaction.guild){
		log("ERROR", "setupGame.ts", `No guild found.`);
		return
	}

	if(!getRoles(interaction)){
		log("ERROR", "setupGame.ts", `Something went wrong grabbing roles.`);
		return;
	}

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

function getRoles(interaction: ModalSubmitInteraction): boolean{
	if(!interaction.guild) return false
	roles.push(interaction.guild.roles.everyone)
	for(const roleName of roleNames){
		const tempRole: Role | undefined = interaction.guild.roles.cache.find(role => role.name === roleName);
		if(tempRole instanceof Role){
			roles.push(tempRole)
		}
		else{
			log("ERROR", "setupGame.ts", `Can't find role: ${roleName}`)
			return false
		}
	}
	return true
}

function getCategoryPermissionsByType(type: string){
	let permissions: ({ id:any; deny?: any[]; allow?: any[] })[] = []
	if (type === "TYPE_MAIN") {
		for(let role of roles){
			if(role.name === '@everyone') permissions.push({id: role.id,deny: [f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow: [f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Levend') permissions.push({id: role.id,allow: [f.ViewChannel,f.SendMessages]})
			if(role.name === 'Dood') permissions.push({id: role.id,deny: [f.SendMessages,f.SendMessagesInThreads]})
			if(role.name === 'Toeschouwer') permissions.push({id: role.id,allow: [f.ViewChannel],deny: [f.SendMessages,f.SendMessagesInThreads]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow: [f.ViewChannel],deny: [f.SendMessages,f.SendMessagesInThreads]})
		}
	}
	else if (type === "TYPE_ROLES") {
		for(let role of roles){
			if(role.name === '@everyone') permissions.push({id: role.id,deny: [f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow: [f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow: [f.ViewChannel],deny: [f.SendMessages,f.SendMessagesInThreads]})
		}
	}
	if (type === "TYPE_BOND") {
		for(let role of roles){
			if(role.name === '@everyone') permissions.push({id: role.id,deny: [f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow: [f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Levend') permissions.push({id: role.id,allow: [f.SendMessages,f.ManageChannels,f.ManageRoles],deny: [f.ViewChannel,]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow: [f.ViewChannel],deny: [f.SendMessages,f.SendMessagesInThreads]})
		}
	}
	return permissions;
}

function getChannelPermissionsByType(type: string) {
	let permissions: ({ id: any; deny?: any[]; allow?: any[] })[] = []
	if (type === "CHANNEL_TYPE_SIGNUP") {
		for (let role of roles) {
			if(role.name === '@everyone') permissions.push({id: role.id,deny:[f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow:[f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Levend') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
			if(role.name === 'Dood') permissions.push({id: role.id,allow:[f.ViewChannel,f.SendMessages]})
			if(role.name === 'Toeschouwer') permissions.push({id: role.id,allow:[f.ViewChannel,f.SendMessages]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow:[f.ViewChannel,f.SendMessages]})
		}
	}
	if (type === "CHANNEL_TYPE_PLAY") {
		for (let role of roles) {
			if(role.name === '@everyone') permissions.push({id: role.id,deny:[f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow:[f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Levend') permissions.push({id: role.id,allow:[f.ViewChannel,f.SendMessages]})
			if(role.name === 'Dood') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
			if(role.name === 'Toeschouwer') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
		}
	}
	if (type === "CHANNEL_TYPE_DOOD") {
		for (let role of roles) {
			if(role.name === '@everyone') permissions.push({id: role.id,deny:[f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow:[f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Levend') permissions.push({id: role.id,deny:[f.ViewChannel]})
			if(role.name === 'Dood') permissions.push({id: role.id,allow:[f.ViewChannel,f.SendMessages]})
			if(role.name === 'Toeschouwer') permissions.push({id: role.id,deny:[f.ViewChannel]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
		}
	}
	if (type === "CHANNEL_TYPE_BOND") {
		for (let role of roles) {
			if(role.name === '@everyone') permissions.push({id: role.id,deny:[f.ViewChannel,f.CreatePrivateThreads]})
			if(role.name === 'DM') permissions.push({id: role.id,allow:[f.ViewChannel,f.ManageChannels,f.SendMessages,f.ManageMessages]})
			if(role.name === 'Levend') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
			if(role.name === 'Dood') permissions.push({id: role.id,deny:[f.ViewChannel]})
			if(role.name === 'Toeschouwer') permissions.push({id: role.id,deny:[f.ViewChannel]})
			if(role.name === 'Achter de schermen') permissions.push({id: role.id,allow:[f.ViewChannel],deny:[f.SendMessages]})
		}
	}
	return permissions
}

export {
	setupGame
}