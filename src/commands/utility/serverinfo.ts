import {
    ChannelType,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import {type Command, CommandNames} from "../../interfaces";

const commandName = CommandNames.ServerInfo;

export default {
    name: commandName,
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription('Get serverinfo'),
    run: async (interaction) => {
        if (interaction.isChatInputCommand()) {
            const serverId = interaction.guild?.id ?? null;
            const serverName = interaction.guild?.name ?? null;
            const serverOwner = interaction.guild?.ownerId ?? '';
            const image = interaction.guild?.iconURL() ?? null;
            const members = await interaction.guild?.members?.fetch();
            const roles = await interaction.guild?.roles?.fetch();

            const allChannels = await interaction.guild?.channels?.fetch();
            const textChannels = interaction.guild?.channels?.cache?.filter((channel) => channel.type === ChannelType.GuildText);
            const categoryChannels = interaction.guild?.channels?.cache?.filter((channel) => channel.type === ChannelType.GuildCategory);
            const voiceChannels = interaction.guild?.channels?.cache?.filter((channel) => channel.type === ChannelType.GuildVoice);
            const publicThreadsChannels = interaction.guild?.channels?.cache?.filter((channel) => channel.type === ChannelType.PublicThread);

            const mainInfo = "" +
                `ID: <@${serverId}>\n` +
                `Owner: <@${serverOwner}>\n` +
                `No. Members: ${members?.size}\n` +
                `No. Roles: ${roles?.size}\n`

            const channelInfo = "" +
                `Channels: ${allChannels?.size}\n` +
                `Categories: ${categoryChannels?.size}\n` +
                `Text Channels: ${textChannels?.size}\n` +
                `Voice Channels: ${voiceChannels?.size}\n` +
                `Threads: ${publicThreadsChannels?.size}\n`


            const embedMessage = new EmbedBuilder()
                .setColor("DarkAqua")
                .setTitle(serverName)
                .setThumbnail(image)
                .addFields(
                    {name: 'Main info', value: mainInfo, inline: true},
                    {name: 'Channel Info', value: channelInfo, inline: true},
                )
            await interaction.reply({embeds: [embedMessage]});
        }
    }
} as Command