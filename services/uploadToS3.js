const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SEC_KEY,
  region: process.env.AWS_REGION,
});

function uploadToS3(buffer, originalName, mimeType) {
  const key = `chat/${Date.now()}-${originalName}`;

  return s3.upload({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    Body: buffer,          // 🔥 must be Buffer
    ContentType: mimeType,
    ACL: "public-read",
  }).promise()
    .then(res => res.Location);
}

module.exports = {uploadToS3};
