import * as Dotenv from 'dotenv'
import { Client, GatewayIntentBits } from "discord.js";
import { deploy } from "../deploy/deploy";

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

client.login(DISCORD_TOKEN)
