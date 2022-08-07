// method to check if login request is valid or not
exports.validateSignupRequest = (req) => {
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

  if (!validateEmail(emailAddress)) {
    return {
      message: "Invalid email format",
      success: false,
    };
  }

  if (!validatePassword(password)) {
    return {
      message: "Invalid password format",
      success: false,
    };
  }

  if (
    !validateString(name) ||
    !validateString(fatherName) ||
    !validateString(gender) ||
    !validateString(dateOfBirth) ||
    !validateString(religion) ||
    !validateString(phoneNumber) ||
    !validateString(userName) ||
    !validateString(addressL1) ||
    !validateString(addressL2) ||
    !validateString(city) ||
    !validateString(state) ||
    !validateString(country) ||
    !validateString(zipCode)
  ) {
    return {
      message: "Invalid signup request",
      success: false,
    };
  }

  return { success: true };
};

// method to check if login request is valid or not
exports.validateLoginRequest = (req) => {
  const { email, password, type } = req.body;

  if (!validateEmail(email)) {
    return {
      message: "Invalid email format",
      success: false,
    };
  }

  if (!validatePassword(password)) {
    return {
      message: "Invalid password format",
      success: false,
    };
  }

  if (!validateString(type)) {
    return {
      message: "Invalid login request",
      success: false,
    };
  }

  return { success: true };
};

// method to check if forgot password request is valid or not
exports.validateForgotPasswordRequest = (req) => {
  const isEmailValidated = validateEmail(req.body.email);

  if (!isEmailValidated) {
    return {
      message: "Invalid email format",
      success: false,
    };
  }

  return { success: true };
};

exports.validatePasswordChangeRequest = (req) => {
  const { email, password, confirmPassword } = req.body;

  if (!validateEmail(email)) {
    return {
      message: "Invalid email",
      success: false,
    };
  }

  if (!validatePassword(password) || !validatePassword(confirmPassword)) {
    return {
      message: "Invalid password format",
      success: false,
    };
  }

  if (password !== confirmPassword) {
    return {
      message: "Passwords mismatched",
      success: false,
    };
  }

  return { success: true };
};

// method to check if a string is valid or not
const validateString = (str) => {
  return str !== undefined && str !== null && str.trim().length > 0;
};

// method to check if an email string is in valid format or not
const validateEmail = (email) => {
  return (
    validateString(email) &&
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );
};

// method to check if a password string is in valid format or not
const validatePassword = (password) => {
  return (
    validateString(password) &&
    String(password).match(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    )
  );
};
