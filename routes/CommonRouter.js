const { Login, Signup } = require("../controllers/CommonController");
const {
  signupRequestValidatorMiddleware,
  loginRequestValidatorMiddleware,
} = require("../middlewares/ValidationMiddleware");
const router = require("express").Router();

router.route("/signup").post(signupRequestValidatorMiddleware, Signup);
router.route("/login").post(loginRequestValidatorMiddleware, Login);


module.exports = router;
