const { BAD_REQUEST_RC } = require("../utils/ResponseCodes");
const {
    validateFileUploadRequest
  } = require("../utils/ValidateMedia");

  exports.uploadRequestValidatorMiddleware = (req, res, next) => {
    const isFileRequestValidated = validateFileUploadRequest(req);
  
    // if request is invalid then return error response
    if (!isFileRequestValidated.success) {
      return res.status(BAD_REQUEST_RC).json({
        message: isFileRequestValidated.message,
        status: BAD_REQUEST_RC,
      });
    }
  
    next();
  };

  