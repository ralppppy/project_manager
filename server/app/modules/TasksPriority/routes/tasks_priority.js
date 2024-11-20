const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetTasksPriorityDropdown,
  handleCreateTaskPriority,
  handleUpdateTaskPriority,
  handleUpdateSort,
  handleDeleteTaskPriority,
} = require("../controllers/TasksPriorityController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/tasks_priority_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetTasksPriorityDropdown
);

router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);

router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteTaskPriority
);

router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  handleCreateTaskPriority
);
router.put(
  "/:organization_id",
  verifyTokenMiddleware,
  handleUpdateTaskPriority
);

module.exports = router;
