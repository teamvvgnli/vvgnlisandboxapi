const {
  INSERT_MEDIA_DETAILS_QUERY
} = require("../configs/databaseConfig/DatabaseQueries");
const { s3Uploadv2 } = require("../utils/S3Service");
const { makeDbCall } = require("../utils/DatabaseCalls");
const { OK_RC } = require("../utils/ResponseCodes");

exports.Upload = async (req,res) => {

    const results = await s3Uploadv2(req.files);

    const mediaIdArray = [];
    results.forEach(function (result) {
      mediaIdArray.push(result.Key);
    })

    const insertMediaQueryResult = await makeDbCall(
      INSERT_MEDIA_DETAILS_QUERY,
      [results.map(result => [result.Key, result.Location,
        (result.Key.split(".").pop() === "jpeg" || result.Key.split(".").pop() === "jpg" || result.Key.split(".").pop() === "png")
          ? 1 : 2, new Date()])]
    );

    if (!insertMediaQueryResult.success) {
      return res.status(insertAddressQueryResult.status).json({
        success: false,
        message: insertMediaQueryResult.message,
      });
    }

    return res.status(OK_RC).json({
      message: "Media file uploaded successfully",
      success: true,
      mediaIdArray : mediaIdArray,
      timestamp: Date.now(),
    });
}