const winston = require("winston");

const Logger = winston.createLogger({
  level: "info", // or 'debug' for more verbose logs
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // You can add more transports as needed (e.g., for different log levels or destinations)
  ],
});

module.exports = Logger;
