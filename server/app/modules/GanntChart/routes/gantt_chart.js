const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetGanttChartData,
  handleCreateGanttChartData,
  handleUpdateGanttChartData,
  handleGetSummary,
  handleGetUserDropdown,
  handleGetDepartmentsWithUsers,
} = require("../controllers/GanntChartController");
const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware.js"
));

router.get(
  "/summary/:organization_id/:client_id/:project_id",
  handleGetSummary
);
router.get(
  "/user_dropdown/:organization_id/:client_id/:project_id",
  handleGetUserDropdown
);
router.get(
  "/departments_users/:organization_id",
  handleGetDepartmentsWithUsers
);
router.get("/:organization_id/:client_id/:project_id", handleGetGanttChartData);

router.put("/:id", handleUpdateGanttChartData);
router.post("/", handleCreateGanttChartData);

module.exports = router;
