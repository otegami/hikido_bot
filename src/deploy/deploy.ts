import { ApplicationCommandOptionType, Guild } from "discord.js";

export const deploy = async (guild: Guild) => {
  await guild.commands.set([
    {
      name: 'join',
      description: 'ボットがあなたのチャンネルに参加します。'
    },
    {
      name: 'record',
      description: 'ボットが録音を行います。',
      options: [
        {
          name: 'speaker',
          type: ApplicationCommandOptionType.User,
          description: '録音するユーザーを指定',
          required: true
        }
      ]
    }
  ])
}
