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
const { EP_Department, EP_Employee, EP_User } = require(path.resolve(
  "database",
  "models"
));

const handleGetDepartmentDropdown = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_Department,
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

const handleGetDepartmentSettings = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_Department,
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

const handleGetDepartments = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_Department,
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

const handleCreateDepartment = async (req, res) => {
  const { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await create(EP_Department, {
    ...data.values,
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateDepartment = async (req, res) => {
  const { organization_id } = req.params;

  let { values } = req.body;

  let { id, ...rest } = values;

  let [response, error] = await update(
    EP_Department,
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

  let [response, error] = await bulkCreate(EP_Department, data, null, {
    updateOnDuplicate: ["sort", "updatedAt"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteDepartment = async (req, res) => {
  const { organization_id, id } = req.params;

  // let [departmentCount, errorCount] = await count(EP_Employee, {
  //   organization_id,
  //   dept_id: id,
  // });

  let [departmentCount, errorCount] = await count(
    EP_User,
    {
      organization_id,
    },
    {
      raw: true,
      include: [
        {
          association: EP_User.employee,
          attributes: [],
          where: {
            dept_id: id,
          },
        },
      ],
    }
  );

  if (departmentCount > 0) {
    return res.status(409).json({
      type: "cannot_be_deleted",
    });
  } else {
    let [response, error] = await destroy(
      EP_Department,
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
  handleGetDepartmentDropdown,
  handleGetDepartmentSettings,
  handleGetDepartments,
  handleCreateDepartment,
  handleUpdateDepartment,
  handleUpdateSort,
  handleDeleteDepartment,
};
