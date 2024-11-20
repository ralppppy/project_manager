const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetTasksStatusDropdown,
  handleCreateTaskStatus,
  handleUpdateTaskStatus,
  handleUpdateSort,
  handleDeleteTaskStatus,
  handleGetTasksStatusSettings,
  handleGetTasksStatusWithCount,
} = require("../controllers/TasksStatusController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/tasks_status_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetTasksStatusDropdown
);
router.get(
  "/tasks_status_with_count/:organization_id",
  verifyTokenMiddleware,
  handleGetTasksStatusWithCount
);

router.get(
  "/tasks_status_settings/:organization_id",
  verifyTokenMiddleware,
  handleGetTasksStatusSettings
);

router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);
router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteTaskStatus
);

router.post("/:organization_id", verifyTokenMiddleware, handleCreateTaskStatus);
router.put("/:organization_id", verifyTokenMiddleware, handleUpdateTaskStatus);

module.exports = router;
