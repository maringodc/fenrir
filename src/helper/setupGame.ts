import {ModalSubmitInteraction, Role, PermissionsBitField , ChannelType} from "discord.js";

const f = PermissionsBitField.Flags;
const basePosition = 2;
let everyoneRole: Role,
	roleDM: Role,
	roleLevend: Role,
	roleDood: Role,
	roleToeschouwer: Role,
	roleSchermen: Role;

async function setupGame(interaction: ModalSubmitInteraction, title: string, number: string) {

	if(!interaction.guild){
		console.log('No guild found..');
		return
	}
	console.log('Grabbing roles..');

	if(!getRoles(interaction)){
		console.log("Something went wrong grabbing roles..");
	}

	console.log('Setting up the game with title: ' + title);

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

	return true;
}

function getRoles(interaction: ModalSubmitInteraction): boolean{
	if(!interaction.guild) return false

	everyoneRole = interaction.guild.roles.everyone;
	const troleDM = interaction.guild.roles.cache.find(role => role.name === 'DM');
	const troleLevend = interaction.guild.roles.cache.find(role => role.name === 'Levend');
	const troleDood = interaction.guild.roles.cache.find(role => role.name === 'Dood');
	const troleToeschouwer = interaction.guild.roles.cache.find(role => role.name === 'Toeschouwer');
	const troleSchermen = interaction.guild.roles.cache.find(role => role.name === 'Achter de schermen');

	if(typeof troleDM === "undefined"){
		return false;
	}
	else {
		roleDM = troleDM
	}


	return true;
}

function getCategoryPermissionsByType(type) {
	let permissions = [
		{
			id: everyoneRole.id,
			deny: [
				f.ViewChannel,
				f.CreatePrivateThreads,
			],
		},
		{
			id: roleDM.id,
			allow: [
				f.ViewChannel,
				f.ManageChannels,
				f.SendMessages,
				f.ManageMessages,
			],
		},
		{
			id: roleDM.id,
			allow: [
				f.ViewChannel,
				f.ManageChannels,
				f.SendMessages,
				f.ManageMessages,
			],
			deny: [
				f.ViewChannel,
				f.CreatePrivateThreads,
			],
		},
	];
	if (type === "TYPE_MAIN") {
		permissions.push(
			{
				id: roleLevend.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleDood.id;
				deny: [
					f.SendMessages,
					f.SendMessagesInThreads,
				];
			}
		);
		permissions.push(
			{
				id: roleToeschouwer.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
					f.SendMessagesInThreads,
				],
			}
		);
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
					f.SendMessagesInThreads,
				],
			}
		);
	}
	else if (type === "TYPE_ROLES") {
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
					f.SendMessagesInThreads,
				],
			}
		);
	}
	else if (type === "TYPE_BOND") {
		permissions.push(
			{
				id: roleLevend.id,
				allow: [
					f.SendMessages,
					f.ManageChannels,
					f.ManageRoles,
				],
				deny: [
					f.ViewChannel,
				]
			}
		);
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
					f.SendMessagesInThreads,
				],
			}
		);
	}
	return permissions;
}

function getChannelPermissionsByType(type) {
	const permissions = [
		{
			id: everyoneRole.id,
			deny: [
				f.ViewChannel,
				f.CreatePrivateThreads,
			],
		},
		{
			id: roleDM.id,
			allow: [
				f.ViewChannel,
				f.ManageChannels,
				f.SendMessages,
				f.ManageMessages,
			],
		},
	];
	if (type === "CHANNEL_TYPE_SIGNUP") {
		permissions.push(
			{
				id: roleLevend.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleDood.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleToeschouwer.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
	}
	else if (type === "CHANNEL_TYPE_PLAY") {
		permissions.push(
			{
				id: roleLevend.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleDood.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleToeschouwer.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
				],
			}
		);
	}
	else if (type === "CHANNEL_TYPE_DOOD") {
		permissions.push(
			{
				id: roleLevend.id,
				deny: [
					f.ViewChannel,
				],
			}
		);
		permissions.push(
			{
				id: roleDood.id,
				allow: [
					f.ViewChannel,
					f.SendMessages,
				],
			}
		);
		permissions.push(
			{
				id: roleToeschouwer.id,
				deny: [
					f.ViewChannel,
				],
			}
		);
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
				],
			}
		);
	}
	else if (type === "CHANNEL_TYPE_BOND") {
		permissions.push(
			{
				id: roleLevend.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
				]
			}
		);
		permissions.push(
			{
				id: roleSchermen.id,
				allow: [
					f.ViewChannel,
				],
				deny: [
					f.SendMessages,
				],
			}
		);
	}
	return permissions;
}

export {
	setupGame
}