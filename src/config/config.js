const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  env: process.env.NODE_ENV,
  default: {
    password: process.env.DEFAULT_PASSWORD,
  },
  server: {
    port: process.env.PORT,
  },
  mongoose: {
    url: process.env.MONGODB_URL,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
  },
  s3Bucket: {
    bucketName: process.env.BUCKET_NAME,
    bucketRegion: process.env.BUCKET_REGION,
    bucketAccessId: process.env.BUCKET_ACCESS_ID,
    bucketAccessKey: process.env.BUCKET_ACCESS_KEY, //config.mongoose.url,
  },
};
