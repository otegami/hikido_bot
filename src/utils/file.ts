import { unlinkSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const getFileDir = (fileUrl: string) => {
  const filename = fileURLToPath(fileUrl)
  return path.dirname(filename)
}

export const deleteFiles = (filesPath: string[]) => {
  filesPath.forEach((file) => unlinkSync(file))
}
