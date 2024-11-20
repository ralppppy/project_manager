const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleSaveFileToDb,
  handleGetCommentFiles,
  handleDeleteAttachment,
  handleGetTaskFiles,
} = require("../controllers/FileController");
const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware.js"
));

router.get(
  "/comment/:comment_id",
  verifyTokenMiddleware,
  handleGetCommentFiles
);

router.get("/task/:task_id", verifyTokenMiddleware, handleGetTaskFiles);
router.delete("/:attachment_id", verifyTokenMiddleware, handleDeleteAttachment);

/* GET users listing. */
router.post("/", verifyTokenMiddleware, handleSaveFileToDb);

module.exports = router;
