import type { VoiceConnection } from "@discordjs/voice"
import type { Client, CommandInteraction, Snowflake } from "discord.js"

export const record = async (
  interaction: CommandInteraction,
  recordable: Set<Snowflake>,
  client: Client,
  connection?: VoiceConnection
) => {
  if (connection) {
    const userId = interaction.options.get('speaker')!.value as Snowflake
    recordable.add(userId)

    await interaction.reply({ ephemeral: true, content: '録音中！' })
  } else {
    await interaction.reply({ ephemeral: true, content: 'ボットが、ボイスチャンネルに参加してから試してください。' })
  }
}
