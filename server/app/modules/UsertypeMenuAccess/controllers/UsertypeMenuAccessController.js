const path = require("path");
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const {
  get,
  bulkCreate,
  create,
  destroy,
  count,
  update,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { EP_UserTypeMenuAccess } = require(path.resolve("database", "models"));

const handleUpdateUserTypeMenuAccess = async (req, res) => {
  let data = req.body;

  let [response, error] = await bulkCreate(EP_UserTypeMenuAccess, data, null, {
    updateOnDuplicate: ["sort", "user_type_id"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleRemoveUserTypeMenuAccess = async (req, res) => {
  let [response, error] = await destroy(EP_UserTypeMenuAccess, {
    ...req.params,
  });
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateLockUserTypeMenuAccess = async (req, res) => {
  let data = req.body;
  let [response, error] = await update(EP_UserTypeMenuAccess, data, {
    ...req.params,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

module.exports = {
  handleUpdateUserTypeMenuAccess,
  handleRemoveUserTypeMenuAccess,
  handleUpdateLockUserTypeMenuAccess,
};
