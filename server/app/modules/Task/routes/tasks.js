const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleCreateTask,
  handleGetTask,
  handleGetTaskDropdown,
  handleUpdateTask,
  handleDeleteMember,
  handleCreateTaskComment,
  handleGetTaskComment,
  handleIndividualTaskInputUpdate,
  handleSingleGetTask,
  handleGetHoursWorked,
  handleDeleteTask,
  handleDeleteComment,
  handleDeleteCommentAndAttachment,
} = require("../controllers/TaskController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

router.get(
  "/comment/:organization_id/:task_id",
  verifyTokenMiddleware,
  handleGetTaskComment
);

router.get(
  "/hours_worked/:organization_id/:task_id",
  verifyTokenMiddleware,
  handleGetHoursWorked
);

router.post(
  "/comment/:organization_id",
  verifyTokenMiddleware,
  handleCreateTaskComment
);
router.delete(
  "/delete_member/:organization_id/:team_task_id",
  verifyTokenMiddleware,
  handleDeleteMember
);
router.delete(
  "/delete_comment/:organization_id/:comment_id",
  verifyTokenMiddleware,
  handleDeleteComment
);
router.delete(
  "/delete_comment_and_attachment/:organization_id/:task_id",
  verifyTokenMiddleware,
  handleDeleteCommentAndAttachment
);

router.put(
  "/input/:task_id",
  verifyTokenMiddleware,
  handleIndividualTaskInputUpdate
);

router.get(
  "/dropdown/:organization_id/:client_id/:project_id/:module_id",
  verifyTokenMiddleware,
  handleGetTaskDropdown
);

router.post("/", verifyTokenMiddleware, handleCreateTask);

router.put("/:task_id", verifyTokenMiddleware, handleUpdateTask);

router.delete(
  "/:organization_id/:task_id",
  verifyTokenMiddleware,
  handleDeleteTask
);
router.get(
  "/:organization_id/:client_id/:project_id/:module_id",
  verifyTokenMiddleware,
  handleGetTask
);
router.get(
  "/:organization_id/:client_id/:project_id/:module_id/:task_id",
  verifyTokenMiddleware,
  handleSingleGetTask
);

module.exports = router;
