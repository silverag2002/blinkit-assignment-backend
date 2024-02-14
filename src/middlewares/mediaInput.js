const multer = require("multer");
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const crypto = require("crypto");
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const config = require("../config/config");
const s3 = new S3Client({
  credentials: {
    accessKeyId: config.s3Bucket.bucketAccessId,
    secretAccessKey: config.s3Bucket.bucketAccessKey,
  },
  region: config.s3Bucket.bucketRegion,
});

const upload = multer();
module.exports = { upload, s3, randomImageName };
