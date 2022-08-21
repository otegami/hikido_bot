import audiosprite from 'audiosprite'
import { unlinkSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { getFileDir } from './file'

export const mergeOggFiles = async () => {
  const fileDir = getFileDir(import.meta.url)
  const recordingDir = path.resolve(fileDir, '../../recordings')

  const files = await readdir(recordingDir)
  const oggFiles = files.filter((file) => path.extname(file) === '.ogg')
    .map((file) => path.resolve(fileDir, `../../recordings/${file}`))

  const opts = { output: './recorded_outputs/result', export: 'ogg' }

  audiosprite(oggFiles, opts, function (err, obj) {
    if (err) return console.error(err)

    oggFiles.forEach((file) => unlinkSync(file))
    console.log(JSON.stringify(obj, null, 2))
  })
}
