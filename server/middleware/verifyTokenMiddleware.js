const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const publicKey = fs.readFileSync(path.resolve("keys", "public.key"));

const verifyToken = (token) => {
  try {
    let decoded = jwt.verify(token, publicKey);
    return [decoded, null];
  } catch (error) {
    return [null, error];
  }
};

const verifyTokenMiddleware = (req, res, next) => {
  if (req.cookies.token) {
    let [decoded, error] = verifyToken(req.cookies.token);
    if (error) {
      res.clearCookie("token");
      return res.status(498).send("Invalid Token");
    }

    if (decoded) {
      req.user = decoded;
      return next();
    } else {
      res.clearCookie("token");
      return res.status(498).send("Invalid Token");
    }
  }
  return res.sendStatus(403);
};

module.exports = { verifyTokenMiddleware, verifyToken };
