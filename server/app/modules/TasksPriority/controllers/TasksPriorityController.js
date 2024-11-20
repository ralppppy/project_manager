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
const { EP_TasksPriority, EP_Task } = require(path.resolve(
  "database",
  "models"
));

const handleGetTasksPriorityDropdown = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_TasksPriority,
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

const handleCreateTaskPriority = async (req, res) => {
  const { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await create(EP_TasksPriority, {
    ...data.values,
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateTaskPriority = async (req, res) => {
  const { organization_id } = req.params;

  let { values } = req.body;
  let { id, ...rest } = values;

  let [response, error] = await update(
    EP_TasksPriority,
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

  let [response, error] = await bulkCreate(EP_TasksPriority, data, null, {
    updateOnDuplicate: ["sort", "updatedAt"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteTaskPriority = async (req, res) => {
  const { organization_id, id } = req.params;

  let [taskCount, errorCount] = await count(EP_Task, {
    organization_id,
    task_priority_id: id,
  });

  if (taskCount > 0) {
    return res.status(409).json({
      type: "cannot_be_deleted",
    });
  } else {
    let [response, error] = await destroy(
      EP_TasksPriority,
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
  handleGetTasksPriorityDropdown,
  handleCreateTaskPriority,
  handleUpdateTaskPriority,
  handleUpdateSort,
  handleDeleteTaskPriority,
};
