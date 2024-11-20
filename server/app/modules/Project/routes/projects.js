const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationProject,
  handleGetOrganizationProject,
  handleCreateProject,
  handleUpdateProject,
  handleGetProjectDetails,
  handleDeleteProjectTeamMember,
  handleDeleteProjectVersion,
  handleGetAllOrganizationProjectDropdown,
  handleUpdatetProjectSorting,
  handleGetProjectSummary,
  handleGetSinglProjectTaskCountComparison,
} = require("../controllers/ProjectController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

router.put(
  "/update_sorting/:organization_id",
  verifyTokenMiddleware,
  handleUpdatetProjectSorting
);

router.get(
  "/project_details/:organization_id",
  verifyTokenMiddleware,
  handleGetProjectDetails
);

router.get(
  "/project_summary/:organization_id/:client_id/:project_id",
  verifyTokenMiddleware,
  handleGetProjectSummary
);

router.get(
  "/project_completion_percent/:organization_id/:client_id/:project_id",
  verifyTokenMiddleware,
  handleGetSinglProjectTaskCountComparison
);

router.put(
  "/project_details/update_sorting/:organization_id",
  verifyTokenMiddleware,
  handleUpdatetProjectSorting
);

router.get(
  "/project_details/:organization_id",
  verifyTokenMiddleware,
  handleGetProjectDetails
);

router.get(
  "/project_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationProjectDropdown
);

router.delete(
  "/delete_team_member/:organization_id/:user_team_id",
  verifyTokenMiddleware,
  handleDeleteProjectTeamMember
);

router.delete(
  "/delete_project_version/:organization_id/:project_version_id",
  verifyTokenMiddleware,
  handleDeleteProjectVersion
);

router.post("/", verifyTokenMiddleware, handleCreateProject);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationProject
);

router.put("/:organization_id/:id", verifyTokenMiddleware, handleUpdateProject);

router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationProject
);
module.exports = router;
