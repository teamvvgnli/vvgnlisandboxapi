exports.CREATE_DB_IF_NOT_EXISTS_QUERY = `CREATE DATABASE IF NOT EXISTS ${
  process.env.MYSQL_DB_NAME || "vvgnli_sih"
}`;

exports.CREATE_ADDRESS_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS address_details(addressId varchar(16), addressL1 varchar(70), addressL2 varchar(70), city varchar(20), state varchar(20), country varchar(30), zipCode varchar(6), primary key(addressId))";

exports.CREATE_USER_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS user_details(userId varchar(16), name varchar(50), password varchar(100) NOT NULL, fatherName varchar(50), gender varchar(20), dateOfBirth date, religion varchar(20), phoneNumber varchar(30), userName varchar(30), emailAddress varchar(30), userRole int DEFAULT 2, addressId varchar(16), PRIMARY KEY (userId), unique key unq_user_details_2 (emailAddress,userRole), CONSTRAINT user_details_ibfk_1 FOREIGN KEY (addressId) REFERENCES address_details (addressId))";

exports.CREATE_MEDIA_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS media_details(mediaId varchar(100), mediaURL varchar(200), fileType int, currentTimeStamp TIMESTAMP, primary key(mediaId))";

exports.CREATE_POST_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS post_details(userId varchar(16), mediaId varchar(100), status int DEFAULT 2, PRIMARY KEY (userId,mediaId), CONSTRAINT post_details_ibfk_1 FOREIGN KEY (userId) REFERENCES user_details (userId), CONSTRAINT post_details_ibfk_2 FOREIGN KEY (mediaId) REFERENCES media_details (mediaId))";

exports.CREATE_COMMENT_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS comment_details (commentId int auto_increment, mediaId varchar(200), commentData varchar(5000), userId varchar(16), fullName varchar(200), primary key(commentId), CONSTRAINT comment_details_ibfk_1 FOREIGN KEY (mediaId) REFERENCES media_details (mediaId), CONSTRAINT comment_details_ibfk_2 FOREIGN KEY (userId) REFERENCES user_details (userId))";

exports.CREATE_LIKE_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS like_details (userId varchar(16), mediaId varchar(200), primary key(userId, mediaId), CONSTRAINT like_details_ibfk_1 FOREIGN KEY (userId) REFERENCES user_details (userId), CONSTRAINT like_details_ibfk_2 FOREIGN KEY (mediaId) REFERENCES media_details (mediaId))";

exports.INSERT_ADDRESS_DETAILS_QUERY =
  "INSERT INTO address_details (addressId, addressL1, addressL2, city, state, country, zipCode) VALUES (?,?,?,?,?,?,?)";

exports.INSERT_USER_DETAILS_QUERY = `INSERT INTO user_details (userId, name, fatherName, gender, dateOfBirth, religion, phoneNumber, userName, emailAddress, addressId, password) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

exports.FIND_USER_BY_EMAIL_QUERY =
  "SELECT userId, password, userName, userRole from user_details WHERE emailAddress = ?";

exports.INSERT_MEDIA_DETAILS_QUERY = 
  "Insert into media_details(mediaId, mediaURL, fileType, currentTimeStamp) values ?";

exports.SELECT_USER_ROLE_QUERY = 
  "Select userRole from user_details where userId = ?"

exports.INSERT_POST_DETAILS_QUERY = 
  "Insert into post_details (userId, mediaId, status) values ?";

exports.UPDATE_POST_STATUS_QUERY = 
  "Update post_details set status = 1 where mediaId = ?";

exports.DELETE_POST_DETAILS_QUERY = 
  "Delete from post_details where mediaId = ?";

exports.DELETE_MEDIA_DETAILS_QUERY = 
  "Delete from media_details where mediaId = ?";

exports.INSERT_LIKE_DETAILS = 
  "Insert into like_details values(?,?)";

exports.DELETE_LIKE_DETAILS = 
  "Delete from like_details where userId = ? and mediaId = ?";

exports.FIND_NAME_BY_USER_ID_QUERY = 
  "Select name from user_details where userId = ?";

exports.INSERT_COMMENT_DETAILS_QUERY = 
  "Insert into comment_details(mediaId, commentData, userId, fullName) values (?,?,?,?)";

exports.GET_PENDING_PHOTOS_QUERY = 
  "Select m.mediaId, m.mediaURL from media_details m, post_details p where p.mediaId = m.mediaId and p.status = 2 and m.fileType = 1";

exports.GET_PENDING_VIDEOS_QUERY = 
  "Select m.mediaId, m.mediaURL from media_details m, post_details p where p.mediaId = m.mediaId and p.status = 2 and m.fileType = 2";

exports.GET_APPROVED_PHOTOS_QUERY = 
  "Select m.mediaId, m.mediaURL, u.name from media_details m, post_details p, user_details u where p.mediaId = m.mediaId and p.status = 1 and m.fileType = 1 and p.userId = u.userId;";

exports.GET_TOTAL_LIKES_ON_APPROVED_PHOTOS_QUERY = 
  "Select l.mediaId , count(l.userId) as totalLikes from like_details l where l.mediaId in (select m.mediaId from post_details p, media_details m where p.status = 1 and m.fileType = 1 and p.mediaId = m.mediaId) group by l.mediaId";

exports.GET_TOTAL_COMMENTS_ON_APPROVED_PHOTOS_QUERY = 
  "Select c.mediaId , count(c.commentId) as totalComments from comment_details c where c.mediaId in (select m.mediaId from post_details p, media_details m where p.status = 1 and m.fileType = 1 and p.mediaId = m.mediaId) group by c.mediaId";

exports.GET_APPROVED_VIDEOS_QUERY = 
  "Select m.mediaId, m.mediaURL from media_details m, post_details p where p.mediaId = m.mediaId and p.status = 1 and m.fileType = 2";

exports.GET_TOTAL_LIKES_ON_APPROVED_VIDEOS_QUERY = 
  "Select l.mediaId , count(l.userId) as totalLikes from like_details l where l.mediaId in (select m.mediaId from post_details p, media_details m where p.status = 1 and m.fileType = 2 and p.mediaId = m.mediaId) group by l.mediaId";

exports.GET_TOTAL_COMMENTS_ON_APPROVED_VIDEOS_QUERY = 
  "Select c.mediaId , count(c.commentId) as totalComments from comment_details c where c.mediaId in (select m.mediaId from post_details p, media_details m where p.status = 1 and m.fileType = 2 and p.mediaId = m.mediaId) group by c.mediaId";

exports.GET_COMMENTS_ON_POST_QUERY = 
  "Select fullName, commentData from comment_details where mediaId = ?";

exports.GET_LIKED_POSTS_BY_USER_QUERY = 
  "Select mediaId from like_details where userId = ?";

