import { entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"
import { Client, CommandInteraction, GuildMember, Snowflake } from "discord.js"
import { createListeningStream } from "../utils/listeningStream"

export const join = async (
  interaction: CommandInteraction,
  recordable: Set<Snowflake>,
  client: Client,
  connection?: VoiceConnection
) => {
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
