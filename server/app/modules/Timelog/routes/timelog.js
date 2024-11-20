const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetUserFilterTimelogTree,
  handleGetUserTimelogTree,
  handleGetUserTimelogResources,
  handleGetStatusFilterSelect,
  handleCreateTimelogData,
  handleGetTimelogData,
  handleUpdateTimelogData,
  handleDeleteTimelog,
} = require("../controllers/TimelogController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */

router.get(
  "/timelog_events/:organization_id",
  verifyTokenMiddleware,
  handleGetTimelogData
);

router.get(
  "/filter/:organization_id/:user_id",
  verifyTokenMiddleware,
  handleGetUserFilterTimelogTree
);
router.get(
  "/status/:organization_id",
  verifyTokenMiddleware,
  handleGetStatusFilterSelect
);
router.get(
  "/timelog_resources/:organization_id",
  verifyTokenMiddleware,
  handleGetUserTimelogResources
);

router.get(
  "/:organization_id/:user_id",
  verifyTokenMiddleware,
  handleGetUserTimelogTree
);

router.delete(
  "/delete_timelog/:organization_id/:timelog_id",
  verifyTokenMiddleware,
  handleDeleteTimelog
);

router.post("/:organization_id", handleCreateTimelogData);
router.put("/:id", handleUpdateTimelogData);

module.exports = router;
