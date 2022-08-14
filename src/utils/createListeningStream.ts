import path from 'path'
import { fileURLToPath } from "url"
import { createWriteStream } from 'fs'
import { pipeline } from 'stream';
import { EndBehaviorType, VoiceReceiver } from "@discordjs/voice";
import { User } from "discord.js";
import * as Prism from 'prism-media'

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

  const opusDecoder = new Prism.opus.Decoder({
    frameSize: 960,
    channels: 2,
    rate: 48000,
  })

  const filename = fileURLToPath(import.meta.url)
  const fileDir = path.dirname(filename)
  const fileName = path.resolve(fileDir, `../../recordings/${Date.now()}-${getDisplayName(userId, user)}.pcm`)

  const out = createWriteStream(fileName)

  console.log(`${fileName} に録音を始めました！`)

  pipeline(opusStream, out, (err) => {
    if (err) {
      console.error(`${fileName} への録音に失敗しました。理由は、${err.message}です。`)
    } else {
      console.log(`${fileName} への録音が完了しました！`)
    }
  })
}
