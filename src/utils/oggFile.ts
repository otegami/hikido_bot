import audiosprite from 'audiosprite'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const mergeOggFiles = async () => {
  const filename = fileURLToPath(import.meta.url)
  const fileDir = path.dirname(filename)
  const recordingDir = path.resolve(fileDir, '../../recordings')

  const files = await readdir(recordingDir)
  const oggFiles = files.filter((file) => path.extname(file) === '.ogg')
    .map((file) => path.resolve(fileDir, `../../recordings/${file}`))

  const opts = { output: 'result' }

  audiosprite(oggFiles, opts, function (err, obj) {
    if (err) return console.error(err)

    console.log(JSON.stringify(obj, null, 2))
  })
}
