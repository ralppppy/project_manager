const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetUserTypeStatusDropdown,
  handleCreateUserTypeStatus,
  handleUpdateUserTypeStatus,
  handleUpdateSort,
  handleDeleteUserTypeStatus,
  handleGetUserTypeStatusSettings,
  handleGetUserTypeStatusSettingsMenus,
} = require("../controllers/UserTypeController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
// router.post("/", verifyTokenMiddleware, handleCreateClient);

router.get(
  "/user_type_dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetUserTypeStatusDropdown
);

router.get(
  "/user_type_settings/:organization_id",
  verifyTokenMiddleware,
  handleGetUserTypeStatusSettings
);
router.get(
  "/user_type_settings_menus/:organization_id",
  verifyTokenMiddleware,
  handleGetUserTypeStatusSettingsMenus
);

router.put(
  "/update_sort/:organization_id",
  verifyTokenMiddleware,
  handleUpdateSort
);
router.delete(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleDeleteUserTypeStatus
);

router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  handleCreateUserTypeStatus
);
router.put(
  "/:organization_id",
  verifyTokenMiddleware,
  handleUpdateUserTypeStatus
);

module.exports = router;
