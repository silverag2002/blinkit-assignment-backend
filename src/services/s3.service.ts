import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
const mediaInput = require("../middlewares/mediaInput.js");
const config = require("../config/config");
export const getMediaUrl = async (Key, Bucket = config.s3Bucket.bucketName) => {
  const bucketInfo = {
    Bucket,
    Key,
  };
  const command = new GetObjectCommand(bucketInfo);
  let url;
  try {
    url = await getSignedUrl(mediaInput.s3, command, { expiresIn: 3600 });
  } catch (err) {
    console.log(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong with AWS S3"
    );
  }
  return url;
};

export const deleteFile = async (Key, Bucket = config.s3Bucket.bucketName) => {
  const bucketInfo = {
    Bucket,
    Key,
  };
  const command = new DeleteObjectCommand(bucketInfo);
  let response;
  try {
    response = await mediaInput.s3.send(command);
    console.log("Response", response);
  } catch (err) {
    console.log(err);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong with AWS S3"
    );
  }
};

export const uploadFile = async (
  file,
  fileName,
  Bucket = config.s3Bucket.bucketName
) => {
  const params = {
    Bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  console.log("COMMAND", params);
  const command = new PutObjectCommand(params);
  const response = await mediaInput.s3.send(command);
  console.log("REsponse from aws", response);
  if (response.$metadata.httpStatusCode !== 200) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Could not upload file to S3"
    );
  } else {
    return response;
  }
};
