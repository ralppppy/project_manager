const path = require("path");
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const sequelize = require("sequelize");

const {
  get,
  bulkCreate,
  create,
  destroy,
  count,
  update,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { EP_TasksStatus, EP_Task } = require(path.resolve("database", "models"));

const handleGetTasksStatusDropdown = async (req, res) => {
  const { organization_id } = req.params;
  let [response, error] = await get(
    EP_TasksStatus,
    { organization_id, active: true },
    [["sort", "ASC"]],
    [
      "id",
      "name",
      "color",
      "organization_id",
      "sort",
      "active",
      ["id", "key"],
      ["id", "value"],
      ["name", "title"],
    ]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const formatGetTaskWhere = (column, value) => {
  return isNaN(value)
    ? value.toLowerCase().includes("all")
      ? {}
      : { [column]: null }
    : { [column]: value };
};

const handleGetTasksStatusWithCount = async (req, res) => {
  const { organization_id } = req.params;
  let {
    selectedFilter: {
      clientId: client_id,
      projectId: project_id,
      moduleId: module_id,
    },
    isFeedback,
  } = req.query;

  let user = req.user;
  //if isNaN(module_id) / module_id === All then do not query for specific module

  //convert string to boolean
  const isEmployee = user.is_employee;

  let moduleIdWhere = formatGetTaskWhere("module_id", module_id);
  let projectIdWhere = formatGetTaskWhere("project_id", project_id);
  let clientIdWhere = formatGetTaskWhere("client_id", client_id);

  //convert string to boolean
  isFeedback = isFeedback === "true";

  let isFeedbackWhere = {};

  if (isEmployee) {
    isFeedbackWhere = isFeedback
      ? { is_feedback: true }
      : { is_feedback: false };
  } else {
    clientIdWhere = { ...clientIdWhere, client_id: user.client.client_id };
  }

  let [response, error] = await get(
    EP_TasksStatus,
    { organization_id, active: true },
    [["sort", "ASC"]],
    [
      "id",
      "name",
      "color",
      "sort",
      [sequelize.fn("COUNT", sequelize.col("tasks.id")), "tasksCount"],
    ],
    null,
    {
      group: ["id"],
      include: [
        {
          required: false,
          association: EP_TasksStatus.tasks,
          attributes: [],
          where: {
            ...moduleIdWhere,
            ...projectIdWhere,
            ...clientIdWhere,
            ...isFeedbackWhere,
          },
        },
      ],
    }
  );
  console.log(error);
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleGetTasksStatusSettings = async (req, res) => {
  const { organization_id } = req.params;
  let [response, error] = await get(
    EP_TasksStatus,
    { organization_id },
    [["sort", "ASC"]],
    [
      "id",
      "name",
      "color",
      "organization_id",
      "sort",
      "active",
      ["id", "key"],
      ["id", "value"],
      ["name", "title"],
      ["name", "label"],
    ]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleCreateTaskStatus = async (req, res) => {
  const { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await create(EP_TasksStatus, {
    ...data.values,
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleUpdateTaskStatus = async (req, res) => {
  const { organization_id } = req.params;

  let { values } = req.body;

  let { id, ...rest } = values;

  let [response, error] = await update(
    EP_TasksStatus,
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

  let [response, error] = await bulkCreate(EP_TasksStatus, data, null, {
    updateOnDuplicate: ["sort", "updatedAt"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteTaskStatus = async (req, res) => {
  const { organization_id, id } = req.params;

  let [taskCount, errorCount] = await count(EP_Task, {
    organization_id,
    task_status_id: id,
  });

  if (taskCount > 0) {
    return res.status(409).json({
      type: "cannot_be_deleted",
    });
  } else {
    let [response, error] = await destroy(
      EP_TasksStatus,
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
  handleGetTasksStatusDropdown,
  handleGetTasksStatusSettings,
  handleCreateTaskStatus,
  handleUpdateTaskStatus,
  handleUpdateSort,
  handleDeleteTaskStatus,
  handleGetTasksStatusWithCount,
};
