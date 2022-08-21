import fs from "node:fs"
import * as Dotenv from 'dotenv'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileURLToPath } from "node:url";
import path from "node:path";

Dotenv.config()
const bucketName = process.env.S3_BUCKET
const region = process.env.REGION

if (!bucketName || !region) {
  console.error('Error: S3_BUCKET または、REGION が設定されていません！')
  process.exit(1)
}

const s3Client = new S3Client({ region })

export const uploadAudioFileToS3 = async (fileKey: string, fileName: string) => {
  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: fs.createReadStream(fileName),
  };
  return await s3Client.send(new PutObjectCommand(params))
}

export const uploadRecordedOggFile = async () => {
  const filename = fileURLToPath(import.meta.url)
  const fileDir = path.dirname(filename)
  const recordedFile = path.resolve(fileDir, '../../recorded_outputs/result.ogg')

  try {
    await uploadAudioFileToS3(`${Date.now()}.ogg`, recordedFile)
  } catch (error) {
    console.error(error)
  }
}
