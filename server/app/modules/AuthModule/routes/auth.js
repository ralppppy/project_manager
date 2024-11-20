const express = require("express");
const path = require("path");
const router = express.Router();

const {
  logout,
  login,
  verifyUserToken,
  verifySetPasswordToken,
  setPassword,
  sendEmailToRecoverAccount,
  updatePassword,
} = require("../controllers/AuthController");
const {
  setPasswordValidation,
  updatePasswordValidation,
} = require("../validator/Validator");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware.js"
));

//For Guest
router.post("/logout", logout);
router.post("/verify_token", verifyTokenMiddleware, verifyUserToken);
router.post("/verify_set_password_token", verifySetPasswordToken);
router.post("/set_password", setPasswordValidation, setPassword);

//Logged in
router.post(
  "/update_password",
  verifyTokenMiddleware,
  updatePasswordValidation,
  updatePassword
);
router.post(
  "/recover_account",
  setPasswordValidation,
  sendEmailToRecoverAccount
);
/* GET users listing. */
router.post("/", login);

module.exports = router;
