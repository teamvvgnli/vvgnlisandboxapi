const { ProcessPasswordUpdate } = require("../controllers/CommonController");
const {
  passwordChangeRequestValidatorMiddleware,
} = require("../middlewares/ValidationMiddleware");

const router = require("express").Router();

router
  .route("/update-password")
  .post(passwordChangeRequestValidatorMiddleware, ProcessPasswordUpdate);

module.exports = router;
