const express = require("express");
const router = express.Router();
const path = require("path");
const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));
const {
  handleGetOrganizationUsers,
  handleGetOrganizationUser,
  handleGetAllOrganizationUserDropdown,
  handleCreateUser,
  handleUpdateUser,
  handleSendEmail,
  handleGetClientUsers,
  handleCreateUserClient,
} = require("../controllers/UsersController");

const {
  userValidation,
  userClientValidation,
} = require("../validator/Validator");

/* GET users listing. */
// router.get("/", handleGetOrganizationUsers);
// router.get("/:id", handleGetOrganizationUser);

router.get(
  "/client/:organization_id/:client_id",
  verifyTokenMiddleware,
  handleGetClientUsers
);

router.get("/send_email/wow", handleSendEmail);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationUserDropdown
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  userValidation,
  handleUpdateUser
);
router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationUser
);
router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetOrganizationUsers
);

router.post(
  "/create_client/:organization_id",
  verifyTokenMiddleware,
  userClientValidation,
  handleCreateUserClient
);

router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  userValidation,
  handleCreateUser
);

// router.put("/:id", verifyTokenMiddleware, handleUpdateUser);

module.exports = router;
