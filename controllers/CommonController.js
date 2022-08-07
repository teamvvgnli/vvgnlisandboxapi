const {
  INSERT_ADDRESS_DETAILS_QUERY,
  INSERT_USER_DETAILS_QUERY,
  FIND_USER_BY_EMAIL_QUERY,
} = require("../configs/databaseConfig/DatabaseQueries");
const { makeDbCall } = require("../utils/DatabaseCalls");
const { CREATED_RC, OK_RC, BAD_REQUEST_RC } = require("../utils/ResponseCodes");
const {
  generateHashedPassword,
  checkPassword,
} = require("../utils/PasswordUtils");
const crypto = require("crypto");

// signup controller method
exports.Signup = async (req, res) => {
  const {
    name,
    fatherName,
    gender,
    dateOfBirth,
    religion,
    phoneNumber,
    userName,
    emailAddress,
    password,
    addressL1,
    addressL2,
    city,
    state,
    country,
    zipCode,
  } = req.body;

  const addressId = generateRandomId();

  const insertAddressQueryResult = await makeDbCall(
    INSERT_ADDRESS_DETAILS_QUERY,
    [addressId, addressL1, addressL2, city, state, country, zipCode]
  );

  if (!insertAddressQueryResult.success) {
    // add logic to delete adove saved address from db

    return res.status(insertAddressQueryResult.status).json({
      success: false,
      message: insertAddressQueryResult.message,
    });
  }

  const userId = generateRandomId();

  const insertUserQueryResult = await makeDbCall(INSERT_USER_DETAILS_QUERY, [
    userId,
    name,
    fatherName,
    gender,
    dateOfBirth,
    religion,
    phoneNumber,
    userName,
    emailAddress,
    addressId,
    generateHashedPassword(password),
  ]);

  if (!insertUserQueryResult.success) {
    return res.status(insertUserQueryResult.status).json({
      success: false,
      message: insertUserQueryResult.message,
    });
  }

  return res.status(CREATED_RC).json({
    message: `User created successfully with userId: ${userId}`,
    success: true,
    timestamp: Date.now(),
  });
};

// login controller method
exports.Login = async (req, res) => {
  const { emailAddress, password, loginType } = req.body;

  const findUserByEmailQueryResult = await makeDbCall(
    FIND_USER_BY_EMAIL_QUERY,
    [emailAddress]
  );

  if (!findUserByEmailQueryResult.success) {
    return res.status(findUserByEmailQueryResult.status).json({
      message: findUserByEmailQueryResult.message,
      success: false,
      timestamp: Date.now(),
    });
  }

  const user = findUserByEmailQueryResult.response[0][0];

  if (!user || !checkPassword(password, user?.password)) {
    return res.status(BAD_REQUEST_RC).json({
      message: "Invalid login credentials",
      success: false,
      timestamp: Date.now(),
    });
  }

  if (loginType !== user?.userRole?.toString()) {
    return res.status(BAD_REQUEST_RC).json({
      message:
        generateErrorMessageAccordingToRequestedAndActualUserRole(loginType),
      success: false,
      timestamp: Date.now(),
    });
  }

  res.status(OK_RC).json({
    message: "Login successful",
    user: {
      userId: user.userId,
      email: user.emailAddress,
      role: user.userRole,
    },
    success: true,
    timestamp: Date.now(),
  });
};

// method to generate random id of 16 bytes
const generateRandomId = () => {
  return crypto.randomBytes(8).toString("hex");
};

const generateErrorMessageAccordingToRequestedAndActualUserRole = (
  loginType
) => {
  let errorMessage;

  switch (loginType) {
    case "1":
      errorMessage = "Username is not registered as admin";
      break;

    case "2":
      errorMessage = "Username is not registered as normal user";
      break;

    default:
      errorMessage = "Invalid loginType provided";
      break;
  }

  return errorMessage;
};
