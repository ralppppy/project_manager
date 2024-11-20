const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetDepartmentDropdown,
  handleGetDepartments,
  handleCreateDepartment,
  handleUpdateDepartment,
  handleUpdateSort,
  handleDeleteDepartment,
  handleGetDepartmentSettings,
} = require("../controllers/DepartmentController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/department_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetDepartmentDropdown
);
router.get(
  "/department_settings/:organization_id",
  verifyTokenMiddleware,
  handleGetDepartmentSettings
);
router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);

router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteDepartment
);

router.get("/:organization_id", verifyTokenMiddleware, handleGetDepartments);
router.post("/:organization_id", verifyTokenMiddleware, handleCreateDepartment);
router.put("/:organization_id", verifyTokenMiddleware, handleUpdateDepartment);

module.exports = router;
