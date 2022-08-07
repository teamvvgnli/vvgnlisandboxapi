const {Upload} = require("../controllers/UploadFileController");
const multer = require("multer");
const {uploadRequestValidatorMiddleware} = require("../middlewares/UploadValidationMiddleware");
// const {fileFilter} = require("../middlewares/FileFilter");
const router = require("express").Router();

const storage = multer.memoryStorage()
const upload = multer({ storage });
router.route("/upload").post(upload.array("file"), uploadRequestValidatorMiddleware,  Upload);

module.exports = router;