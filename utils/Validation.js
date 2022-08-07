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
  const { emailAddress, password, loginType } = req.body;

  if (!validatePassword(password)) {
    return {
      message: "Invalid password format",
      success: false,
    };
  }

  if (!validateEmail(emailAddress)) {
    return {
      message: "Invalid email format",
      success: false,
    };
  }

  if (!validateString(loginType)) {
    return {
      message: "Invalid login request",
      success: false,
    };
  }

  return { success: true };
};


exports.validatePostHandleRequest = (req) => {
  const {userId, mediaIdArray} = req.body;

  if (
    !validateString(userId) ||
    !validateArray(mediaIdArray) 
  ) {
    return {
      message: "Invalid post handle request",
      success: false,
    };
  }

  return { success: true };
};

exports.validatePostStatusRequest = (req) => {
  const {mediaId, postStatus} = req.body;
  if (
    !validateString(mediaId) ||
    !validateString(postStatus) 
  ) {
    return {
      message: "Invalid update post status request",
      success: false,
    };
  }

  return { success: true };
}

exports.validateLikeRequest = (req) => {
  const {userId, mediaId, likeStatus} = req.body;
  if (
    !validateString(userId) || 
    !validateString(mediaId) ||
    !validateString(likeStatus) 
  ) {
    return {
      message: "Invalid like request",
      success: false,
    };
  }

  return { success: true };
}

exports.validateCommentRequest = (req) => {
  const {userId, mediaId, commentData} = req.body;
  if (
    !validateString(userId) || 
    !validateString(mediaId) ||
    !validateString(commentData) 
  ) {
    return {
      message: "Invalid comment request",
      success: false,
    };
  }

  return { success: true };
}

exports.validateGetCommentRequest = (req) => {
  const {mediaId} = req.query;
  if(!validateString(mediaId)){
    return {
      message: "Invalid get comment request",
      success: false,
    };
  }

  return { success: true };
}

exports.validateGetLikedPostsRequest = (req) => {
  const {userId} = req.query;
  if(!validateString(userId)){
    return {
      message: "Invalid get liked posts request",
      success: false,
    };
  }

  return { success: true };
}

const validateArray = (arr) => {
  return arr.length > 0 && arr.every((ele) => validateString(ele));
}

// method to check if a string is valid or not
const validateString = (str) => {
  console.log(str);
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
