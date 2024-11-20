const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetHoliday,
  handleCreateHoliday,
} = require("../controllers/HolidayController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get("/:organization_id", verifyTokenMiddleware, handleGetHoliday);
router.post("/:organization_id", verifyTokenMiddleware, handleCreateHoliday);

module.exports = router;
