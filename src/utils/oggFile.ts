import audiosprite from 'audiosprite'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { deleteFiles, getFileDir } from './file'

export const mergeOggFiles = async () => {
  const fileDir = getFileDir(import.meta.url)
  const recordingDir = path.resolve(fileDir, '../../recordings')

  const oggFiles = await getOggFiles(recordingDir)
  const opts = { output: './recorded_outputs/result', export: 'ogg' }

  audiosprite(oggFiles, opts, (err, obj) => {
    if (err) return console.error(err)

    deleteFiles(oggFiles)
    console.log(JSON.stringify(obj, null, 2))
  })
}

const getOggFiles = async (fileDir: string) => {
  const files = await readdir(fileDir)
  const oggFiles = files.filter((file) => path.extname(file) === '.ogg')
  return oggFiles.map((file) => path.resolve(fileDir, file))
}
