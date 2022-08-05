const {
  INSERT_ADDRESS_DETAILS_QUERY,
  INSERT_USER_DETAILS_QUERY,
  FIND_USER_BY_EMAIL_QUERY,
  PASSWORD_UPDATE_QUERY,
} = require("../configs/databaseConfig/DatabaseQueries");
const { makeDbCall } = require("../utils/DatabaseCalls");
const {
  CREATED_RC,
  OK_RC,
  BAD_REQUEST_RC,
  INTERNAL_SERVER_ERROR_RC,
} = require("../utils/ResponseCodes");
const {
  generateHashedPassword,
  checkPassword,
  generateRandomPassword,
} = require("../utils/PasswordUtils");
const {
  sendForgotPasswordEmail,
  sendPasswordChangedSuccessEmail,
} = require("../utils/EmailSender");
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
  const { email, password, type } = req.body;

  const findUserByEmailResult = await makeDbCall(FIND_USER_BY_EMAIL_QUERY, [
    email,
  ]);

  if (!findUserByEmailResult.success) {
    return res.status(findUserByEmailResult.status).json({
      message: findUserByEmailResult.message,
      success: false,
      timestamp: Date.now(),
    });
  }

  const user = findUserByEmailResult.response[0][0];

  if (!user || !checkPassword(password, user?.password)) {
    return res.status(BAD_REQUEST_RC).json({
      message: "Invalid login credentials",
      success: false,
      timestamp: Date.now(),
    });
  }

  if (type !== user?.userRole?.toString()) {
    return res.status(BAD_REQUEST_RC).json({
      message: generateErrorMessageAccordingToRequestedAndActualUserRole(type),
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
      isTempPassword: user.isTempPassword,
    },
    success: true,
    timestamp: Date.now(),
  });
};

exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;

  const findUserByEmailResult = await makeDbCall(FIND_USER_BY_EMAIL_QUERY, [
    email,
  ]);

  if (!findUserByEmailResult.success) {
    return res.status(findUserByEmailResult.status).json({
      message:
        "Error in forgot password request, check your email and try again",
      success: false,
      timestamp: Date.now(),
    });
  }

  const user = findUserByEmailResult.response[0][0];

  if (!user) {
    return res.status(BAD_REQUEST_RC).json({
      message: `No account found with emailId: ${email}`,
      success: false,
      timestamp: Date.now(),
    });
  }

  const _tempPassword = generateRandomPassword();
  const temporaryPassword = generateHashedPassword(_tempPassword);
  const expiredInMinutes = process.env.TEMP_PASS_EXPIRES_IN || 10;
  const expiresAt = Date.now() + expiredInMinutes * 60000;

  const tempPasswordUpdateQueryResponse = await makeDbCall(
    PASSWORD_UPDATE_QUERY,
    [temporaryPassword, true, expiresAt, user.emailAddress, user.userId]
  );

  if (!tempPasswordUpdateQueryResponse.success) {
    return res.status(INTERNAL_SERVER_ERROR_RC).json({
      message: tempPasswordUpdateQueryResponse.message,
      success: tempPasswordUpdateQueryResponse.status,
      timestamp: Date.now(),
    });
  }

  // send email to user with temporary password
  const sendForgotPasswordEmailResponse = await sendForgotPasswordEmail(
    user.emailAddress,
    _tempPassword,
    expiredInMinutes
  );

  return res.status(sendForgotPasswordEmailResponse.status).json({
    message: sendForgotPasswordEmailResponse.message,
    success: sendForgotPasswordEmailResponse.success,
    status: sendForgotPasswordEmailResponse.status,
  });
};

exports.ProcessPasswordUpdate = async (req, res) => {
  const { email, password } = req.body;

  const findUserByEmailResult = await makeDbCall(FIND_USER_BY_EMAIL_QUERY, [
    email,
  ]);

  if (!findUserByEmailResult.success) {
    return res.status(findUserByEmailResult.status).json({
      message: findUserByEmailResult.message,
      success: false,
      timestamp: Date.now(),
    });
  }

  const user = findUserByEmailResult.response[0][0];

  if (!user) {
    return res.status(BAD_REQUEST_RC).json({
      message: `No user found with emailId: ${email}`,
      success: false,
      timestamp: Date.now(),
    });
  }

  const passwordExpiresTime = user.tpExpiresAt - Date.now();

  if (passwordExpiresTime < 0) {
    return res.status(BAD_REQUEST_RC).json({
      message: "Your temporary password is expired. Please generate again",
      success: false,
      timestamp: Date.now(),
    });
  }

  const passwordUpdateQueryResponse = await makeDbCall(PASSWORD_UPDATE_QUERY, [
    generateHashedPassword(password),
    false,
    0,
    user.emailAddress,
    user.userId,
  ]);

  if (!passwordUpdateQueryResponse.success) {
    return res.status(passwordUpdateQueryResponse.status).json({
      message: passwordUpdateQueryResponse.message,
      success: passwordUpdateQueryResponse.status,
      timestamp: Date.now(),
    });
  }

  // send email to user with temporary password
  sendPasswordChangedSuccessEmail(user.emailAddress);

  return res.status(OK_RC).json({
    message: "Password updated successfully",
    success: true,
    status: OK_RC,
  });
};

// method to generate random id of 16 bytes
const generateRandomId = () => {
  return crypto.randomBytes(8).toString("hex");
};

// method to generate error message if wrong login type is selected corresponding to userType
const generateErrorMessageAccordingToRequestedAndActualUserRole = (
  loginType
) => {
  let errorMessage;

  switch (loginType) {
    case "1":
      errorMessage = "You are not registered as admin";
      break;

    case "2":
      errorMessage = "You are not registered as normal user";
      break;

    default:
      errorMessage = "Invalid loginType provided";
      break;
  }

  return errorMessage;
};
