import { Client, GatewayIntentBits } from "discord.js";

const { DISCORD_TOKEN } = process.env

if (!DISCORD_TOKEN) {
  console.error("Error: DISCORD_TOKEN が設定されていません！")
  process.exit(1)
}

const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
})

client.on('ready', () => console.log('Ready'))

client.login(DISCORD_TOKEN)
