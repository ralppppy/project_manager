const path = require("path");
const Op = require("sequelize").Op;
const sequelize = require("sequelize");
const {
  get,
  getOne,
  create,
  update,
  bulkCreate,
  destroy,
  upsert,
  getExistingByColumn,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const { EP_TaskCompletionSetting } = require(path.resolve(
  "database",
  "models"
));

const handleSetCompletedStatus = async (req, res) => {
  let { organization_id } = req.params;
  let { status_id } = req.body;

  let [existing, error] = await getExistingByColumn(
    EP_TaskCompletionSetting,
    "organization_id",
    organization_id
  );

  if (existing) {
    let [updateResponse, updateError] = await update(
      EP_TaskCompletionSetting,
      { task_status_id: status_id },
      { organization_id }
    );

    if (updateError) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, updateResponse));
    }
  } else {
    let [createrResponse, createError] = await create(
      EP_TaskCompletionSetting,
      {
        task_status_id: status_id,
        organization_id,
      }
    );

    if (createError) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, createrResponse));
    }
  }
};

const handleGetCurrentCompleteStatus = async (req, res) => {
  let { organization_id } = req.params;

  let [status, error] = await getOne(EP_TaskCompletionSetting, {
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, status));
  }
};

module.exports = { handleSetCompletedStatus, handleGetCurrentCompleteStatus };
