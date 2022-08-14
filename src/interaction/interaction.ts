import { entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { Client, CommandInteraction, GuildMember, Snowflake, Collection } from "discord.js";
import { createListeningStream } from "../utils/createListeningStream";

const join = async (
  interaction: CommandInteraction,
  recordable: Set<Snowflake>,
  client: Client,
  connection?: VoiceConnection
) => {
  // 詳しく挙動を調べる
  await interaction.deferReply()
  if (!connection) {
    if (interaction.member instanceof GuildMember && interaction.member.voice.channel) {
      const channel = interaction.member.voice.channel
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        selfDeaf: false,
        selfMute: true,
        adapterCreator: channel.guild.voiceAdapterCreator
      })
    } else {
      await interaction.followUp('ボイスチャンネルに入った状態でコマンドを実行してください！')
      return
    }
  }

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 20e3)
    const receiver = connection.receiver

    receiver.speaking.on('start', (userId) => {
      if (recordable.has(userId)) {
        createListeningStream(receiver, userId, client.users.cache.get(userId))
      }
    })
  } catch (error) {
    console.error(error)
    await interaction.followUp('20 秒たってもボイスチャンネルに参加することができませんでした。もう一度実行してください！')
  }

  await interaction.followUp('Ready!')
}

const record = async (
  interaction: CommandInteraction,
  recordable: Set<Snowflake>,
  client: Client,
  connection?: VoiceConnection
) => {
  if (connection) {
    const userId = interaction.options.get('speaker')!.value as Snowflake
    recordable.add(userId)

    const receiver = connection.receiver
    if (connection.receiver.speaking.users.has(userId)) {
      createListeningStream(receiver, userId, client.users.cache.get(userId))
    }

    await interaction.reply({ ephemeral: true, content: '録音中！' })
  } else {
    await interaction.reply({ ephemeral: true, content: 'ボットが、ボイスチャンネルに参加してから試してください。' })
  }
}

export const interactionHandlers = new Collection<
  string,
  (
    interaction: CommandInteraction,
    recordable: Set<Snowflake>,
    client: Client,
    connection?: VoiceConnection,
  ) => Promise<void>
>()

interactionHandlers.set('join', join)
interactionHandlers.set('record', record)
