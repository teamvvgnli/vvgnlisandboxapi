const chalk = require("chalk");
const mysql = require("mysql2/promise");
const {
  OK_RC,
  BAD_REQUEST_RC,
  INTERNAL_SERVER_ERROR_RC,
} = require("./ResponseCodes");

exports.makeDbCall = async (query, params) => {
  try {
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB_NAME || "vvgnli_sih",
    });

    return db
      .query(query, params)
      .then((res) => {
        return { success: true, response: res, status: OK_RC };
      })
      .catch((err) => {
        return { success: false, message: err.message, status: BAD_REQUEST_RC };
      });
  } catch (err) {
    console.error(chalk.bgRedBright(`${query} to DB failed: ${err.message}`));

    return {
      success: false,
      message: err.message,
      status: INTERNAL_SERVER_ERROR_RC,
    };
  }
};
