const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetDepartments,
  handleGetUserProjects,
  handleGetUnassignedTasks,
  handleGetUnassignedProjects,
  handleGetChartData,
  handleGetTasklistPopover,
} = require("../controllers/DashboardController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

router.get(
  "/chart_data/:organization_id",
  verifyTokenMiddleware,
  handleGetChartData
);
router.get(
  "/user_projects/:organization_id/:user_id",
  verifyTokenMiddleware,
  handleGetUserProjects
);
router.get(
  "/task_list_popover/:organization_id/:user_id/:project_id",
  verifyTokenMiddleware,
  handleGetTasklistPopover
);
router.get(
  "/unassigned_tasks/:organization_id",
  verifyTokenMiddleware,
  handleGetUnassignedTasks
);
router.get(
  "/unassigned_projects/:organization_id",
  verifyTokenMiddleware,
  handleGetUnassignedProjects
);
router.get("/:organization_id", verifyTokenMiddleware, handleGetDepartments);

module.exports = router;
