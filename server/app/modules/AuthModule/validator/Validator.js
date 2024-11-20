const { check } = require("express-validator");
const handleValidatePassword = (value) => {
  if (!value) {
    throw new Error("Password is required");
  }

  // Check if the password is at least 8 characters long.
  if (value.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  // Check if the password contains at least one uppercase letter.
  if (!/[A-Z]/.test(value)) {
    throw new Error("Password must contain at least one uppercase letter.");
  }

  // Check if the password contains at least one lowercase letter.
  if (!/[a-z]/.test(value)) {
    throw new Error("Password must contain at least one lowercase letter.");
  }

  // Check if the password contains at least one digit.
  if (!/\d/.test(value)) {
    throw new Error("Password must contain at least one digit.");
  }

  // Check if the password contains at least one special character.
  if (!/[@$!%*?&^()_+{}\[\]:;,~`\-|\\./=]/.test(value)) {
    throw new Error("Password must contain at least one special character.");
  }

  return true; // Return true if the validation passes
};
const setPasswordValidation = [
  check("password").custom(handleValidatePassword),
  check("confirm")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true; // Return true if the validation passes
    }),
];

const updatePasswordValidation = [
  // check("currentPassword").custom(handleValidatePassword),
  check("password").custom(handleValidatePassword),
  check("confirm")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true; // Return true if the validation passes
    }),
];

module.exports = { setPasswordValidation, updatePasswordValidation };
