const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationProject,
  handleGetOrganizationProject,
  handleGetAllOrganizationProjectDropdown,
  handleCreateProject,
  handleGetUpdatProject,
  handleGetProjectRoleDropdown,
  handleCreateProjectRole,
  handleUpdateProjectRole,
  handleUpdateSort,
  handleDeleteProjectRole,
} = require("../controllers/ProjectRoleController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
router.post("/", verifyTokenMiddleware, handleCreateProject);

router.get(
  "/project_role_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetProjectRoleDropdown
);

router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationProjectDropdown
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationProject
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetUpdatProject
);

router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteProjectRole
);

router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationProject
);
router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  handleCreateProjectRole
);

router.put("/:organization_id", verifyTokenMiddleware, handleUpdateProjectRole);

module.exports = router;
