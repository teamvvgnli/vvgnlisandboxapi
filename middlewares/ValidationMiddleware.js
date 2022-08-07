const { BAD_REQUEST_RC } = require("../utils/ResponseCodes");
const {
  validateSignupRequest,
  validateLoginRequest,
} = require("../utils/Validation");

/* middleware to validate if signup request is valid or not 
calling utils method to validate 
and if not validating then returning bad request response from middleware itself
no need to even touch controller method and no need to add validations in controller method
we are making sure that only validated request will hit our controller method*/
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



