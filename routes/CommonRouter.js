const {
  Login,
  Signup,
  ForgotPassword,
} = require("../controllers/CommonController");
const {
  signupRequestValidatorMiddleware,
  loginRequestValidatorMiddleware,
  forgotPasswordRequestValidatorMiddleware,
} = require("../middlewares/ValidationMiddleware");
const router = require("express").Router();

router.route("/signup").post(signupRequestValidatorMiddleware, Signup);
router.route("/login").post(loginRequestValidatorMiddleware, Login);
router
  .route("/forgot-password")
  .post(forgotPasswordRequestValidatorMiddleware, ForgotPassword);

module.exports = router;
