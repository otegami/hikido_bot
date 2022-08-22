import type { VoiceConnection } from "@discordjs/voice"
import type { Client, CommandInteraction, Snowflake } from "discord.js"
import { mergeOggFiles } from "../utils/oggFile"

export const leave = async (
  interaction: CommandInteraction,
  recordable: Set<Snowflake>,
  client: Client,
  connection?: VoiceConnection
) => {
  if (connection) {
    connection.destroy()
    recordable.clear()

    await mergeOggFiles()
    await interaction.reply({ ephemeral: true, content: 'ボイスチャンネルから離脱しました！' })
  } else {
    await interaction.reply({ ephemeral: true, content: 'ボットはボイスチャンネルに参加してません。' })
  }
}
