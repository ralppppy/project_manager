const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationClientDropdown,
  handleGetAllOrganizationProjectDropdown,
  handleCreateModule,
  handleGetUserDropdown,
  handleGetModuleList,
  handleGetSingleModule,
  handleDeleteModuleTeamMember,
  handleUpdateModuleList,
  handleDeleteModuleTeamMemberProject,
  handleGetTeam,
  handleGetGanttChartModules,
  handleGetModuleListDropdown,
  handleGetSingleModuleTaskCountComparison,
  handleCountTotalAndWorkedHours,
} = require("../controllers/ModuleListController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/gantt_chart/:organization_id/:client_id/:project_id",
  handleGetGanttChartModules
);

router.get(
  "/clients_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationClientDropdown
);

router.get(
  "/projects_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationProjectDropdown
);
router.get(
  "/user_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetUserDropdown
);
router.get(
  "/single/:organization_id/:client_id/:project_id/:module_id",
  verifyTokenMiddleware,
  handleGetSingleModule
);
router.get(
  "/task_completion_percent/:organization_id/:client_id/:project_id/:module_id",
  verifyTokenMiddleware,
  handleGetSingleModuleTaskCountComparison
);

router.get(
  "/task_time_total/:organization_id/:client_id/:project_id/:module_id",
  verifyTokenMiddleware,
  handleCountTotalAndWorkedHours
);
router.get(
  "/team/:organization_id/:client_id/:project_id/:module_id",
  verifyTokenMiddleware,
  handleGetTeam
);

router.get(
  "/dropdown/:organization_id/:client_id/:project_id",
  verifyTokenMiddleware,
  handleGetModuleListDropdown
);

router.get(
  "/:organization_id/:client_id/:project_id",
  verifyTokenMiddleware,
  handleGetModuleList
);
router.delete(
  "/delete_team_member/:module_team_id",
  verifyTokenMiddleware,
  handleDeleteModuleTeamMember
);
router.delete(
  "/delete_team_member_project/:project_team_id",
  verifyTokenMiddleware,
  handleDeleteModuleTeamMemberProject
);
router.put("/:id", verifyTokenMiddleware, handleUpdateModuleList);
router.post("/", verifyTokenMiddleware, handleCreateModule);

module.exports = router;
