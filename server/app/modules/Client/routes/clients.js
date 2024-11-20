const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationClient,
  handleGetOrganizationClient,
  handleGetAllOrganizationClientDropdown,
  handleCreateClient,
  handleGetUpdatClient,
  handleGetClientsWithProjectFilter,
} = require("../controllers/ClientController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationClientDropdown
);
router.get(
  "/filter_client_project/:organization_id",
  verifyTokenMiddleware,
  handleGetClientsWithProjectFilter
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationClient
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetUpdatClient
);
router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationClient
);

module.exports = router;
