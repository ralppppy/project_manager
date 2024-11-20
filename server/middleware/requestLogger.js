const path = require("path");
const Logger = require(path.resolve("utils", "Logger", "Logger.js")); // Import the logger module

function requestLogger(req, res, next) {
  Logger.info({
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });

  res.on("finish", () => {
    Logger.info({
      status: res.statusCode,
      responseTime: Date.now() - req.startTime, // Assuming you set req.startTime earlier
    });
  });

  next();
}

module.exports = requestLogger;
