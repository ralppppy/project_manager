const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetTasksTypeDropdown,
  handleGetTasksTypes,
  handleCreateTaskType,
  handleUpdateTaskType,
  handleUpdateSort,
  handleDeleteTaskType,
  handleGetTasksTypeSettings,
} = require("../controllers/TasksTypeController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/tasks_type_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetTasksTypeDropdown
);
router.get(
  "/tasks_type_settings/:organization_id",
  verifyTokenMiddleware,
  handleGetTasksTypeSettings
);
router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);

router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteTaskType
);

router.get("/:organization_id", verifyTokenMiddleware, handleGetTasksTypes);
router.post("/:organization_id", verifyTokenMiddleware, handleCreateTaskType);
router.put("/:organization_id", verifyTokenMiddleware, handleUpdateTaskType);

module.exports = router;
