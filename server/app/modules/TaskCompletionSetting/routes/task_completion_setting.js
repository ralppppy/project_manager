const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleSetCompletedStatus,
  handleGetCurrentCompleteStatus,
} = require("../controllers/TaskCompletionSettingController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  handleSetCompletedStatus
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetCurrentCompleteStatus
);

module.exports = router;
