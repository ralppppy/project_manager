const path = require("path");
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const {
  get,
  bulkCreate,
  create,
  count,
  destroy,
  update,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { EP_TasksType, EP_Task } = require(path.resolve("database", "models"));

const handleGetTasksTypeDropdown = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_TasksType,
    { organization_id, active: true },
    [["sort", "ASC"]],
    ["id", "name", "color", "active"]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetTasksTypeSettings = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_TasksType,
    { organization_id },
    [["sort", "ASC"]],
    ["id", "name", "color", "active"]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetTasksTypes = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_TasksType,
    { organization_id },
    [["sort", "ASC"]],
    ["id", "name", "color", "sort", "active"]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleCreateTaskType = async (req, res) => {
  const { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await create(EP_TasksType, {
    ...data.values,
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateTaskType = async (req, res) => {
  const { organization_id } = req.params;

  let { values } = req.body;

  let { id, ...rest } = values;

  let [response, error] = await update(
    EP_TasksType,
    {
      ...rest,
    },
    { id, organization_id }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateSort = async (req, res) => {
  const { organization_id } = req.params;

  let { data } = req.body;

  let [response, error] = await bulkCreate(EP_TasksType, data, null, {
    updateOnDuplicate: ["sort", "updatedAt"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteTaskType = async (req, res) => {
  const { organization_id, id } = req.params;

  let [taskCount, errorCount] = await count(EP_Task, {
    organization_id,
    task_type_id: id,
  });

  if (taskCount > 0) {
    return res.status(409).json({
      type: "cannot_be_deleted",
    });
  } else {
    let [response, error] = await destroy(
      EP_TasksType,
      { organization_id, id },
      null,
      {
        updateOnDuplicate: ["sort", "updatedAt"],
      }
    );
    if (error) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, response));
    }
  }
};

module.exports = {
  handleGetTasksTypeDropdown,
  handleGetTasksTypeSettings,
  handleGetTasksTypes,
  handleCreateTaskType,
  handleUpdateTaskType,
  handleUpdateSort,
  handleDeleteTaskType,
};
