const {SlashCommandBuilder, PermissionsBitField , ChannelType} = require('discord.js');
const f = PermissionsBitField.Flags;
const basePosition = 2;
let everyoneRole,
	roleDM,
	roleLevend,
	roleDood,
	roleToeschouwer,
	roleSchermen;

async function setupGame(interaction, title, number) {

	console.log('Grabbing roles..');

	everyoneRole = interaction.guild.roles.everyone;
	roleDM = interaction.guild.roles.cache.find(role => role.name === 'DM');
	roleLevend = interaction.guild.roles.cache.find(role => role.name === 'Levend');
	roleDood = interaction.guild.roles.cache.find(role => role.name === 'Dood');
	roleToeschouwer = interaction.guild.roles.cache.find(role => role.name === 'Toeschouwer');
	roleSchermen = interaction.guild.roles.cache.find(role => role.name === 'Achter de schermen');

	console.log('Setting up the game with title: ' + title);

	const mainCategory = await interaction.guild.channels.create({
		name: 'WW' + number + ' - ' + title,
		type: ChannelType.GuildCategory,
		permissionOverwrites: getCategoryPermissionsByType("TYPE_MAIN"),
	});
	mainCategory.setPosition(3);

	const rolesCategory = await interaction.guild.channels.create({
		name: 'WW' + number + ' - Speciale Rollen',
		type: ChannelType.GuildCategory,
		permissionOverwrites: getCategoryPermissionsByType("TYPE_ROLES"),
	}).then();
	rolesCategory.setPosition(3);

	const bond1Category = await interaction.guild.channels.create({
		name: 'WW' + number + ' - Bondjes 1',
		type: ChannelType.GuildCategory,
		permissionOverwrites: getCategoryPermissionsByType("TYPE_BOND"),
	});
	bond1Category.setPosition(3);

	const bond2Category = await interaction.guild.channels.create({
		name: 'WW' + number + ' - Bondjes 2',
		type: ChannelType.GuildCategory,
		permissionOverwrites: getCategoryPermissionsByType("TYPE_BOND"),
	});
	bond2Category.setPosition(3);

	const channInschrijvingen = await interaction.guild.channels.create({
		name: 'Inschrijvingen',
		type: ChannelType.GuildText,
		parent: mainCategory.id,
		permissionOverwrites: getChannelPermissionsByType("TYPE_SIGNUP"),
	});

	const channStembus = await interaction.guild.channels.create({
		name: 'Stembus',
		type: ChannelType.GuildText,
		parent: mainCategory.id,
		permissionOverwrites: getChannelPermissionsByType("TYPE_PLAY"),
	});

	const channTactiek = await interaction.guild.channels.create({
		name: 'Tactiek',
		type: ChannelType.GuildText,
		parent: mainCategory.id,
		permissionOverwrites: getChannelPermissionsByType("TYPE_PLAY"),
	});

	const channRP1 = await interaction.guild.channels.create({
		name: 'RP - 1',
		type: ChannelType.GuildText,
		parent: mainCategory.id,
		permissionOverwrites: getChannelPermissionsByType("TYPE_PLAY"),
	});

	const channRP2 = await interaction.guild.channels.create({
		name: 'RP - 2',
		type: ChannelType.GuildText,
		parent: mainCategory.id,
		permissionOverwrites: getChannelPermissionsByType("TYPE_PLAY"),
	});

	const channDodenrijk = await interaction.guild.channels.create({
		name: 'Dodenrijk',
		type: ChannelType.GuildText,
		parent: mainCategory.id,
		permissionOverwrites: getChannelPermissionsByType("TYPE_DOOD"),
	});

	return true;
}

function getCategoryPermissionsByType(type) {
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
				id: roleDood.id,
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
	if (type === "TYPE_SIGNUP") {
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
	else if (type === "TYPE_PLAY") {
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
	else if (type === "TYPE_DOOD") {
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
	return permissions;
}

exports.setupGame = setupGame;