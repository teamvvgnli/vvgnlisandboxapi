const {
    SELECT_USER_ROLE_QUERY,
    INSERT_POST_DETAILS_QUERY,
    UPDATE_POST_STATUS_QUERY,
    DELETE_POST_DETAILS_QUERY,
    DELETE_MEDIA_DETAILS_QUERY,
    INSERT_LIKE_DETAILS,
    DELETE_LIKE_DETAILS,
    FIND_NAME_BY_USER_ID_QUERY,
    INSERT_COMMENT_DETAILS_QUERY,
    GET_PENDING_PHOTOS_QUERY,
    GET_PENDING_VIDEOS_QUERY,
    GET_APPROVED_PHOTOS_QUERY,
    GET_APPROVED_VIDEOS_QUERY,
    GET_COMMENTS_ON_POST_QUERY,
    GET_LIKED_POSTS_BY_USER_QUERY,
    GET_TOTAL_LIKES_ON_APPROVED_PHOTOS_QUERY,
    GET_TOTAL_COMMENTS_ON_APPROVED_PHOTOS_QUERY,
    GET_TOTAL_LIKES_ON_APPROVED_VIDEOS_QUERY,
    GET_TOTAL_COMMENTS_ON_APPROVED_VIDEOS_QUERY,
  } = require("../configs/databaseConfig/DatabaseQueries");
const { makeDbCall } = require("../utils/DatabaseCalls");
const { CREATED_RC, OK_RC } = require("../utils/ResponseCodes");
const {s3Delete} = require("../utils/S3Service");

exports.PostHandle = async (req,res) => {
    const {userId, mediaIdArray} = req.body;

    const fetchUserRoleQueryResult = await makeDbCall(
        SELECT_USER_ROLE_QUERY,
        [userId]
    );

    if (!fetchUserRoleQueryResult.success) {
        return checkSuccess(fetchUserRoleQueryResult, res); 
    }

    const status = fetchUserRoleQueryResult.response[0][0].userRole;
    
    const insertPostDetailsQueryResult = await makeDbCall(
        INSERT_POST_DETAILS_QUERY,
        [mediaIdArray.map(mediaIdSingle => [userId, mediaIdSingle, status])]
    )

    if (!insertPostDetailsQueryResult.success) {
        return checkSuccess(insertPostDetailsQueryResult, res); 
    }

    return res.status(CREATED_RC).json({
        message: `Post uploaded successfully with userId: ${userId}`,
        success: true,
        timestamp: Date.now(),
      });
}

exports.UpdatePostStatus = async (req,res) => {
    const { mediaId, postStatus} = req.body;

    if(postStatus === "1"){
        const updatePostStatusQueryResult = await makeDbCall(
            UPDATE_POST_STATUS_QUERY,
            [mediaId]
        )

        if (!updatePostStatusQueryResult.success) {
            return checkSuccess(updatePostStatusQueryResult, res); 
        }
    }

    else{
        makeDbCall(
            DELETE_POST_DETAILS_QUERY,
            [mediaId]
        )

        makeDbCall(
            DELETE_MEDIA_DETAILS_QUERY,
            [mediaId]
        )

        s3Delete(mediaId);

    }

    return res.status(CREATED_RC).json({
        message: "Post status updated successfully",
        success: true,
        timestamp: Date.now(),
    });

}

exports.Like = async (req,res) => {
    const { userId, mediaId, likeStatus } = req.body;

    if(likeStatus === "1"){
        const insertLikeDetailsQueryResult = await makeDbCall(
            INSERT_LIKE_DETAILS,
            [userId, mediaId]
        )

        if (!insertLikeDetailsQueryResult.success) {
            return checkSuccess(insertLikeDetailsQueryResult, res); 
        }
    }
    else{
        const deleteLikeDetailsQuery = await makeDbCall(
            DELETE_LIKE_DETAILS,
            [userId,mediaId]
        )

        if (!deleteLikeDetailsQuery.success) {
            return checkSuccess(deleteLikeDetailsQuery, res); 
        }
    }

    return res.status(OK_RC).json({
        message: "Like status updated successfully",
        success: true,
        timestamp: Date.now(),
    });
}

exports.Comment = async (req,res) => {
    const {userId, mediaId, commentData} = req.body;

    const findNameByUserIdQueryResult = await makeDbCall(
        FIND_NAME_BY_USER_ID_QUERY,
        [userId]
    )

    if (!findNameByUserIdQueryResult.success) {
        return checkSuccess(findNameByUserIdQueryResult, res); 
    }

    const fullName = findNameByUserIdQueryResult.response[0][0].name;

    const insertCommentDetailsQueryResult = await makeDbCall(
        INSERT_COMMENT_DETAILS_QUERY,
        [mediaId, commentData, userId, fullName]
    )

    if (!insertCommentDetailsQueryResult.success) {
        return checkSuccess(insertCommentDetailsQueryResult, res); 
    }

    return res.status(CREATED_RC).json({
        message: "Comment successfully",
        success: true,
        timestamp: Date.now(),
    });

}

exports.GetPendingPhotos = async (req,res) => {
    const getPendingPhotosQueryResult = await makeDbCall(
        GET_PENDING_PHOTOS_QUERY
    )

    if (!getPendingPhotosQueryResult.success) {
        return checkSuccess(getPendingPhotosQueryResult, res); 
    }

    return res.status(CREATED_RC).json({
        message: "Fetched successfully",
        pendingPhotosArray : getPendingPhotosQueryResult.response[0],
        success: true,
        timestamp: Date.now(),
    });
}

exports.GetPendingVideos = async (req,res) => {
    const getPendingVideosQueryResult = await makeDbCall(
        GET_PENDING_VIDEOS_QUERY
    )

    if (!getPendingVideosQueryResult.success) {
        return checkSuccess(getPendingVideosQueryResult, res); 
    }

    return res.status(CREATED_RC).json({
        message: "Fetched successfully",
        pendingVideosArray : getPendingVideosQueryResult.response[0],
        success: true,
        timestamp: Date.now(),
    });
}

exports.GetApprovedPhotos = async (req,res) => {
    const getApprovedPhotosQueryResult = await makeDbCall(
        GET_APPROVED_PHOTOS_QUERY
    )

    if (!getApprovedPhotosQueryResult.success) {
        return checkSuccess(getApprovedPhotosQueryResult, res); 
    }

    const getTotalLikesQueryResult = await makeDbCall( 
        GET_TOTAL_LIKES_ON_APPROVED_PHOTOS_QUERY
    )

    if (!getTotalLikesQueryResult.success) {
        return checkSuccess(getTotalLikesQueryResult, res); 
    }

    const getTotalCommentsQueryResult = await makeDbCall( 
        GET_TOTAL_COMMENTS_ON_APPROVED_PHOTOS_QUERY
    )

    if (!getTotalCommentsQueryResult.success) {
        return checkSuccess(getTotalCommentsQueryResult, res); 
    }

    const approvedPhotosList = getApprovedPhotosQueryResult.response[0];
    const likePostList = getTotalLikesQueryResult.response[0];
    const commentPostList = getTotalCommentsQueryResult.response[0];

    let result = getApprovedMediaArray(approvedPhotosList, likePostList, commentPostList);
    

    return res.status(CREATED_RC).json({
        message: "Fetched successfully",
        approvedPhotosArray : result,
        success: true,
        timestamp: Date.now(),
    });
}

exports.GetApprovedVideos = async (req,res) => {
    const getApprovedVideosQueryResult = await makeDbCall(
        GET_APPROVED_VIDEOS_QUERY
    )

    if (!getApprovedVideosQueryResult.success) {
        return checkSuccess(getApprovedVideosQueryResult, res); 
    }

    const getTotalLikesQueryResult = await makeDbCall( 
        GET_TOTAL_LIKES_ON_APPROVED_VIDEOS_QUERY
    )

    if (!getTotalLikesQueryResult.success) {
        return checkSuccess(getTotalLikesQueryResult, res); 
    }

    const getTotalCommentsQueryResult = await makeDbCall( 
        GET_TOTAL_COMMENTS_ON_APPROVED_VIDEOS_QUERY
    )

    if (!getTotalCommentsQueryResult.success) {
        return checkSuccess(getTotalCommentsQueryResult, res); 
    }

    const approvedVideosList = getApprovedVideosQueryResult.response[0];
    const likePostList = getTotalLikesQueryResult.response[0];
    const commentPostList = getTotalCommentsQueryResult.response[0];

    let result = getApprovedMediaArray(approvedVideosList, likePostList, commentPostList);

    return res.status(OK_RC).json({
        message: "Fetched successfully",
        approvedVideosArray : result,
        success: true,
        timestamp: Date.now(),
    });
}

exports.GetCommentsOnPost = async (req,res) => {
    const {mediaId} = req.query;

    const getCommentsOnPostQueryResult = await makeDbCall(
        GET_COMMENTS_ON_POST_QUERY,
        [mediaId]
    )

    if (!getCommentsOnPostQueryResult.success) {
        return checkSuccess(getCommentsOnPostQueryResult, res); 
    }

    return res.status(CREATED_RC).json({
        message: "Fetched successfully",
        commentsOnPostArray : getCommentsOnPostQueryResult.response[0],
        success: true,
        timestamp: Date.now(),
    });
}

exports.GetLikedPosts = async (req,res) => {
    const {userId} = req.query;

    const getLikedPostsQueryResult = await makeDbCall(
        GET_LIKED_POSTS_BY_USER_QUERY,
        [userId]
    )

    if (!getLikedPostsQueryResult.success) {
        return checkSuccess(getLikedPostsQueryResult, res); 
    }

    return res.status(OK_RC).json({
        message: "Fetched successfully",
        likedPostsArray : getLikedPostsQueryResult.response[0],
        success: true,
        timestamp: Date.now(),
    });
}

const checkSuccess = (queryResult, res) => {
        return res.status(queryResult.status).json({
          success: false,
          message: queryResult.message,
          timestamp: Date.now(),
        });
}

const getApprovedMediaArray = (ApprovedMediaList, likePostList, commentPostList) => {
    let result = [];

    ApprovedMediaList.forEach((postDetails) => {
        let obj = {
            mediaId : postDetails.mediaId,
            mediaURL : postDetails.mediaURL,
            name : postDetails.name,
            totalLikeCount : likePostList.find(like => like.mediaId === `${postDetails.mediaId}`)?.totalLikes || 0,
            totalCommentCount : commentPostList.find(comment => comment.mediaId === `${postDetails.mediaId}`)?.totalComments || 0
        }

        result.push(obj);
    })
    return result;
}
