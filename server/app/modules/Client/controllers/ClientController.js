const path = require("path");
const Op = require("sequelize").Op;
const sequelize = require("sequelize");

const { get, getOne, create, update } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const { EP_Client, EP_Project } = require(path.resolve("database", "models"));

const handleGetAllOrganizationClient = async (req, res) => {
  let { organization_id } = req.params;
  let { paginate, sort, search } = req.query;

  let pagingation = paginate
    ? {
        ...paginate,
      }
    : null;

  let sortFormat = {
    descend: "DESC",
    ascend: "ASC",
  };

  let sorting = sort ? [[sort.field, sortFormat[sort.order]]] : null;

  let searchData = {};

  if (search && search.s) {
    searchData = {
      [search.searchIndex]: {
        [Op.like]: `%${search.s}%`,
      },
    };
  }

  let [clients, error] = await get(
    EP_Client,
    { organization_id, ...searchData },
    sorting,
    [
      "active",
      "client_id_text",
      "createdAt",
      "id",
      "name",
      "organization_id",
      [
        sequelize.literal(`(
        SELECT COUNT(*)
        FROM EP_Projects
        WHERE EP_Projects.client_id = EP_Client.id && EP_Projects.active = 1
      )`),
        "open_projects",
      ],
      [
        sequelize.literal(`(
        SELECT COUNT(*)
        FROM EP_Projects
        WHERE EP_Projects.client_id = EP_Client.id && EP_Projects.active = 0
      )`),
        "closed_projects",
      ],
    ],
    pagingation
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};
const handleGetAllOrganizationClientDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [clients, error] = await get(
    EP_Client,
    { organization_id },
    null,
    ["id", "name"],
    null
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

const handleGetOrganizationClient = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(EP_Client, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateClient = async (req, res) => {
  let data = req.body;

  let [client, error] = await create(EP_Client, data);
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Client id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, client));
  }
};

const handleGetUpdatClient = async (req, res) => {
  let { organization_id, id } = req.params;

  let [client, error] = await update(EP_Client, req.body, {
    organization_id,
    id,
  });
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Client id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, client));
  }
};

const handleGetClientsWithProjectFilter = async (req, res) => {
  let { organization_id } = req.params;
  let user = req.user;

  let { showTask } = req.query;

  showTask = showTask === "true";

  let clientWhere = !user.is_employee
    ? {
        id: user.client.client_id,
      }
    : {};

  let moduleInclude = showTask
    ? {
        include: [
          {
            association: EP_Project.modules,
            attributes: ["id", "name"],
          },
        ],
      }
    : {};

  let [clients, error] = await get(
    EP_Client,
    { organization_id, ...clientWhere },
    null,
    null,
    null,
    {
      include: [
        {
          association: EP_Client.projects,
          attributes: ["id", "name"],
          ...moduleInclude,
        },
      ],
      attributes: ["id", "name"],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

module.exports = {
  handleGetAllOrganizationClient,
  handleGetAllOrganizationClientDropdown,
  handleGetOrganizationClient,
  handleCreateClient,
  handleGetUpdatClient,
  handleGetClientsWithProjectFilter,
};
