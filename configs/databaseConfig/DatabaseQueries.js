exports.CREATE_DB_IF_NOT_EXISTS_QUERY = `CREATE DATABASE IF NOT EXISTS ${
  process.env.MYSQL_DB_NAME || "vvgnli_sih"
}`;

exports.CREATE_ADDRESS_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS address_details(addressId varchar(16), addressL1 varchar(70), addressL2 varchar(70), city varchar(20), state varchar(20), country varchar(30), zipCode varchar(6), primary key(addressId))";

exports.CREATE_USER_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS user_details(userId varchar(16), name varchar(50), password varchar(100) NOT NULL, fatherName varchar(50), gender varchar(20), dateOfBirth date, religion varchar(20), phoneNumber varchar(30), userName varchar(30), emailAddress varchar(30), userRole int DEFAULT 2, isTempPassword BOOLEAN DEFAULT false, tpExpiresAt BIGINT DEFAULT 0 , addressId varchar(16), PRIMARY KEY (userId), unique key unq_user_details_2 (emailAddress,userRole), CONSTRAINT user_details_ibfk_1 FOREIGN KEY (addressId) REFERENCES address_details (addressId))";

exports.CREATE_MEDIA_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS media_details(mediaId varchar(100), mediaURL varchar(200), fileName varchar(100), fileType int, currentTimeStamp TIMESTAMP, primary key(mediaId))";

exports.CREATE_POST_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS post_details(userId varchar(16), mediaId varchar(100), status int, userName varchar(200),PRIMARY KEY (userId,mediaId), CONSTRAINT post_details_ibfk_1 FOREIGN KEY (userId) REFERENCES user_details (userId), CONSTRAINT post_details_ibfk_2 FOREIGN KEY (mediaId) REFERENCES media_details (mediaId))";

exports.CREATE_COMMENT_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS comment_details (commentId int auto_increment, mediaId varchar(200), commentData varchar(5000), userId varchar(16), fullName varchar(200), primary key(commentId), CONSTRAINT comment_details_ibfk_1 FOREIGN KEY (mediaId) REFERENCES media_details (mediaId), CONSTRAINT comment_details_ibfk_2 FOREIGN KEY (userId) REFERENCES user_details (userId))";

exports.CREATE_LIKE_DETAILS_TABLE =
  "CREATE TABLE IF NOT EXISTS like_details (userId varchar(16), mediaId varchar(200), likeStatus int, primary key(userId, mediaId), CONSTRAINT like_details_ibfk_1 FOREIGN KEY (userId) REFERENCES user_details (userId), CONSTRAINT like_details_ibfk_2 FOREIGN KEY (mediaId) REFERENCES media_details (mediaId))";

exports.INSERT_ADDRESS_DETAILS_QUERY =
  "INSERT INTO address_details (addressId, addressL1, addressL2, city, state, country, zipCode) VALUES (?,?,?,?,?,?,?)";

exports.INSERT_USER_DETAILS_QUERY = `INSERT INTO user_details (userId, name, fatherName, gender, dateOfBirth, religion, phoneNumber, userName, emailAddress, addressId, password) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

exports.FIND_USER_BY_USERNAME_QUERY =
  "SELECT * from user_details WHERE userName = ?";

exports.FIND_USER_BY_EMAIL_QUERY =
  "SELECT * from user_details WHERE emailAddress = ?";

exports.PASSWORD_UPDATE_QUERY =
  "UPDATE user_details SET password = ?, isTempPassword = ?, tpExpiresAt = ? WHERE emailAddress = ? AND userId = ?";
