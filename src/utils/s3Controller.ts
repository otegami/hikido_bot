import fs from "node:fs"
import * as Dotenv from 'dotenv'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

try {
  await uploadAudioFileToS3('test.ogg', '/Users/otegami/Coding/typescript/hikido_bot/recordings/1660569245681-Otegami_7590.ogg')
} catch (error) {
  console.error(error)
}
