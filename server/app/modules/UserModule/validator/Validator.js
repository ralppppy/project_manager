const { check } = require("express-validator");

const userValidation = [
  check("first_name").notEmpty().withMessage("First Name is required"),
  check("last_name").notEmpty().withMessage("Last Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("user_type_id")
    .notEmpty()
    .withMessage("User type is required")
    .isNumeric()
    .withMessage("User should be numeric"),
  check("dept_id")
    .notEmpty()
    .withMessage("Department is required")
    .isNumeric()
    .withMessage("Department should be numeric"),
];

const userClientValidation = [
  check("first_name").notEmpty().withMessage("First Name is required"),
  check("last_name").notEmpty().withMessage("Last Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  check("password").notEmpty().withMessage("Password is required"),
];

module.exports = { userValidation, userClientValidation };
