const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const SALT_NUMBER = 10;

const privateKey = fs.readFileSync(path.resolve("keys", "private.key"));

const encryptText = (text) => {
  const salt = bcrypt.genSaltSync(SALT_NUMBER);
  let hash = bcrypt.hashSync(text, salt);
  return hash;
};

const verifyEncryptedText = (text, hash) => {
  return bcrypt.compareSync(text, hash);
};

const createToken = async (payload, options = { expiresIn: "8d" }) => {
  const token = jwt.sign(payload, privateKey, {
    issuer: "InitialIssuer",
    algorithm: "RS256",
    allowInsecureKeySizes: true,
    ...options,
  });

  return token;
};

module.exports = {
  encryptText,
  verifyEncryptedText,
  createToken,
};
