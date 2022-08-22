import * as Dotenv from 'dotenv'
import type { Interaction } from "discord.js"
import { Client, GatewayIntentBits } from "discord.js"
import { deploy } from "../deploy/deploy"
import { getVoiceConnection } from '@discordjs/voice'
import { interactionHandlers } from '../interaction'

Dotenv.config()
const { DISCORD_TOKEN } = process.env

if (!DISCORD_TOKEN) {
  console.error("Error: DISCORD_TOKEN が設定されていません！")
  process.exit(1)
}

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ]
})

client.on('ready', () => console.log('Ready'))

client.on('messageCreate', async (message) => {
  if (!message.guild) return
  if (message.content.toLowerCase() === '!deploy') {
    await deploy(message.guild)
    await message.reply('Deployed!')
  }
})

const recordable = new Set<string>()

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand() || !interaction.guildId) return

  const handler = interactionHandlers.get(interaction.commandName)

  try {
    if (handler) {
      await handler(interaction, recordable, client, getVoiceConnection(interaction.guildId))
    } else {
      await interaction.reply('存在しないコマンドです！')
    }
  } catch (error) {
    console.error(error)
  }
})

client.login(DISCORD_TOKEN)
