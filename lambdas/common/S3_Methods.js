const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { v4: uuidv4 } = require("uuid");
const BUCKET_NAME = "reimbursement-receipt-bucket";

const S3 = {
  async uploadImage(image) {
    let content = image;
    const base64Data = new Buffer.from(
      content.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = content.split(";")[0].split("/")[1];
    const keyName = uuidv4() + `.${type}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: keyName,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };
    const imageUrl = await s3
      .upload(params)
      .promise()
      .catch((err) => {
        throw err;
      });

    return imageUrl.Location;
  },
};
module.exports = S3;
