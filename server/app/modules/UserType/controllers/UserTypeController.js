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
const { EP_UserType, EP_Employee, EP_User } = require(path.resolve(
  "database",
  "models"
));

const handleGetUserTypeStatusDropdown = async (req, res) => {
  const { organization_id } = req.params;
  let [response, error] = await get(
    EP_UserType,
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

const handleGetUserTypeStatusSettings = async (req, res) => {
  const { organization_id } = req.params;
  let [response, error] = await get(
    EP_UserType,
    { organization_id },
    [["sort", "ASC"]],
    ["id", "name", "color", "organization_id", "sort", "active"]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetUserTypeStatusSettingsMenus = async (req, res) => {
  const { organization_id } = req.params;
  let [response, error] = await get(
    EP_UserType,
    { organization_id },
    [
      ["sort", "ASC"],
      [EP_UserType.menu_access, "sort", "ASC"],
    ],
    ["id", "name", "color", "organization_id", "sort", "active"],
    null,
    {
      include: [
        {
          association: EP_UserType.menu_access,
          attributes: [
            "id",
            "is_lock",
            "menu_key_code",
            ["menu_key_code", "key"],
            "user_type_id",
            "organization_id",
            "sort",
          ],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleCreateUserTypeStatus = async (req, res) => {
  const { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await create(EP_UserType, {
    ...data.values,
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleUpdateUserTypeStatus = async (req, res) => {
  const { organization_id } = req.params;

  let { values } = req.body;

  let { id, ...rest } = values;

  let [response, error] = await update(
    EP_UserType,
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

  let [response, error] = await bulkCreate(EP_UserType, data, null, {
    updateOnDuplicate: ["sort", "updatedAt"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteUserTypeStatus = async (req, res) => {
  const { organization_id, id } = req.params;

  let [taskCount, errorCount] = await count(
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
            user_type_id: id,
          },
        },
      ],
    }
  );

  if (taskCount > 0) {
    return res.status(409).json({
      type: "cannot_be_deleted",
    });
  } else {
    let [response, error] = await destroy(
      EP_UserType,
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
  handleGetUserTypeStatusDropdown,
  handleGetUserTypeStatusSettings,
  handleCreateUserTypeStatus,
  handleUpdateUserTypeStatus,
  handleUpdateSort,
  handleDeleteUserTypeStatus,
  handleGetUserTypeStatusSettingsMenus,
};
