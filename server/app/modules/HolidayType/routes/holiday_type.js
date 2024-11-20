const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleUpdateSort,
  handleGetHolidayTypeDropdown,
  handleDeleteHolidayType,
  handleGetHolidayType,
  handleCreateHolidayType,
  handleUpdateHolidayType,
} = require("../controllers/HolidayTypeController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/holiday_type_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetHolidayTypeDropdown
);

router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);

router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteHolidayType
);

router.get("/:organization_id", verifyTokenMiddleware, handleGetHolidayType);
router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  handleCreateHolidayType
);
router.put("/:organization_id", verifyTokenMiddleware, handleUpdateHolidayType);

module.exports = router;
