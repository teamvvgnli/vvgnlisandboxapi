const {PostHandle, UpdatePostStatus, Like, Comment, GetPendingPhotos,
       GetPendingVideos, GetApprovedPhotos, GetApprovedVideos, GetCommentsOnPost, GetLikedPosts }
       = require("../controllers/PostController");
const {
    postHandleRequestValidatorMiddleware,
    updatePostStatusRequestValidatorMiddleware,
    likeRequestValidatorMiddleware,
    commentRequestValidatorMiddleware,
    getCommentRequestValidatorMiddleware,
    getLikedPostsRequestValidatorMiddleware,
  } = require("../middlewares/PostValidationMiddleware");
const router = require("express").Router();

router.route("/postHandle").post(postHandleRequestValidatorMiddleware, PostHandle);
router.route("/updatePostStatus").post(updatePostStatusRequestValidatorMiddleware, UpdatePostStatus);
router.route("/like").post(likeRequestValidatorMiddleware, Like);
router.route("/comment").post(commentRequestValidatorMiddleware, Comment);
router.route("/getPendingPhotos").get(GetPendingPhotos);
router.route("/getPendingVideos").get(GetPendingVideos);
router.route("/getApprovedPhotos").get(GetApprovedPhotos);
router.route("/getApprovedVideos").get(GetApprovedVideos);
router.route("/getCommentsOnPost").get(getCommentRequestValidatorMiddleware, GetCommentsOnPost);
router.route("/getLikedPosts").get(getLikedPostsRequestValidatorMiddleware, GetLikedPosts);

module.exports = router;