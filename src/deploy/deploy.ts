import { Guild } from "discord.js";

export const deploy = async (guild: Guild) => {
  await guild.commands.set([
    {
      name: 'join',
      description: 'ボットがあなたのチャンネルに参加します。'
    }
  ])
}
