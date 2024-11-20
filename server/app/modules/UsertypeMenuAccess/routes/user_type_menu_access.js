const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleUpdateUserTypeMenuAccess,
  handleRemoveUserTypeMenuAccess,
  handleUpdateLockUserTypeMenuAccess,
} = require("../controllers/UsertypeMenuAccessController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

router.post(
  "/:organization_id",
  verifyTokenMiddleware,
  handleUpdateUserTypeMenuAccess
);
router.put(
  "/:organization_id/:user_type_id/:menu_key_code",
  verifyTokenMiddleware,
  handleUpdateLockUserTypeMenuAccess
);

router.delete(
  "/:organization_id/:user_type_id/:menu_key_code",
  verifyTokenMiddleware,
  handleRemoveUserTypeMenuAccess
);

module.exports = router;
