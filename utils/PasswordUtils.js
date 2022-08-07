const bcrypt = require("bcrypt");

// method to generate a secure hashed password from a raw string of password
const generateHashedPassword = (rawPassword) => {
  return bcrypt.hashSync(rawPassword, 10);
};

// method to check if raw password (coming from login page) matches the hashed password (password stored in DB)
const checkPassword = (rawPassword, hashedPassword) => {
  return bcrypt.compareSync(rawPassword, hashedPassword);
};

module.exports = { generateHashedPassword, checkPassword };
