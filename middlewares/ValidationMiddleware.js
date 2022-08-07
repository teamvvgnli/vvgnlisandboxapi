const { BAD_REQUEST_RC } = require("../utils/ResponseCodes");
const {
  validateSignupRequest,
  validateLoginRequest,
  validateForgotPasswordRequest,
  validatePasswordChangeRequest,
} = require("../utils/Validation");

exports.signupRequestValidatorMiddleware = (req, res, next) => {
  const isSignupRequestValidated = validateSignupRequest(req);

  // if request is invalid then return error response
  if (!isSignupRequestValidated.success) {
    return res.status(BAD_REQUEST_RC).json({
      message: isSignupRequestValidated.message,
      status: BAD_REQUEST_RC,
    });
  }

  // if next() executes then only request will be delegated to next middleware (in this case, controller method)
  next(); // it's important and must to call next() otherwise boom
};

// middleware to validate login request
exports.loginRequestValidatorMiddleware = (req, res, next) => {
  const isLoginRequestValidated = validateLoginRequest(req);

  if (!isLoginRequestValidated.success) {
    return res.status(BAD_REQUEST_RC).json({
      message: isLoginRequestValidated.message,
      status: BAD_REQUEST_RC,
    });
  }

  next();
};

exports.forgotPasswordRequestValidatorMiddleware = (req, res, next) => {
  const isForgotPasswordRequestValidated = validateForgotPasswordRequest(req);

  if (!isForgotPasswordRequestValidated.success) {
    return res.status(BAD_REQUEST_RC).json({
      message: isForgotPasswordRequestValidated.message,
      status: BAD_REQUEST_RC,
    });
  }

  next();
};

exports.passwordChangeRequestValidatorMiddleware = (req, res, next) => {
  const isPasswordChangeRequestValidated = validatePasswordChangeRequest(req);

  if (!isPasswordChangeRequestValidated.success) {
    return res.status(BAD_REQUEST_RC).json({
      message: isPasswordChangeRequestValidated.message,
      status: BAD_REQUEST_RC,
    });
  }

  next();
};
