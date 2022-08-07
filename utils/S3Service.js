const {S3} = require("aws-sdk");
const crypto = require("crypto");
const { OK_RC,INTERNAL_SERVER_ERROR_RC } = require("./ResponseCodes");

exports.s3Uploadv2 = async(files) => {
    const s3 = new S3();
    const params = files.map(file => {
        return {
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : `${crypto.randomUUID({disableEntropyCache : true})}.${file.originalname.split(".").pop()}`,
            Body : file.buffer
        };
    })
    return results = await Promise.all(params.map(param => 
        s3.upload(param).promise()));
}

exports.s3Delete = (mediaId) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${mediaId}`
      };

      s3.deleteObject(params, (error, data) => {
        if (error) {
          res.status(INTERNAL_SERVER_ERROR_RC).json({
            success : false,
            message : "Error occurred"
          });
        }

        return res.status(OK_RC).json({
            success : true,
            message: "File has been deleted successfully"
        });
      });
}