const path = require("path");

const { DB_NAME, DB_USER, DB_PASS } = require(path.resolve(
  "database",
  "config",
  "environment.js"
));
const databaseConfig = {
  localhost: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  predevelopment: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  staging: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  demo: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  backupPath: path.resolve("database", "backups"),
};

module.exports = databaseConfig;
