import path from 'node:path'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { EndBehaviorType, VoiceReceiver } from "@discordjs/voice"
import { User } from "discord.js"
import { opus } from 'prism-media'
import { getFileDir } from './file'

const getDisplayName = (userId: string, user?: User) => {
  return user ? `${user.username}_${user.discriminator}` : userId
}

export const createListeningStream = (receiver: VoiceReceiver, userId: string, user?: User) => {
  const opusStream = receiver.subscribe(userId, {
    end: {
      behavior: EndBehaviorType.AfterSilence,
      duration: 1000
    }
  })

  const oggStream = new opus.OggLogicalBitstream({
    opusHead: new opus.OpusHead({
      channelCount: 2,
      sampleRate: 48000,
    }),
    pageSizeControl: {
      maxPackets: 10,
    },
  });

  const fileDir = getFileDir(import.meta.url)
  const fileName = path.resolve(fileDir, `../../recordings/${Date.now()}-${getDisplayName(userId, user)}.ogg`)

  const out = createWriteStream(fileName)

  console.log(`${fileName} に録音を始めました！`)

  pipeline(opusStream, oggStream, out, async (err) => {
    if (err) {
      console.error(`${fileName} への録音に失敗しました。理由は、${err.message}です。`)
    } else {
      console.log(`${fileName} への録音が完了しました！`)
    }
  })
}
