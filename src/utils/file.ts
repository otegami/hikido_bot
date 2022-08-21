import path from "node:path"
import { fileURLToPath } from "node:url"

const getFileDir = (fileUrl: string) => {
  const filename = fileURLToPath(fileUrl)
  return path.dirname(filename)
}

export { getFileDir }
