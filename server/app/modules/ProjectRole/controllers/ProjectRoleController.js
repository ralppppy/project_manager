const path = require("path");
const Op = require("sequelize").Op;

const {
  get,
  getOne,
  create,
  bulkCreate,
  destroy,
  count,
  update,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const { EP_ProjectRole, EP_ProjectTeam } = require(path.resolve(
  "database",
  "models"
));

const handleGetAllOrganizationProject = async (req, res) => {
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

  let [projects, error] = await get(
    EP_ProjectRole,
    { organization_id, ...searchData },
    sorting,
    null,
    pagingation
  );
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, projects));
  }
};
const handleGetAllOrganizationProjectDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [projects, error] = await get(
    EP_ProjectRole,
    { organization_id, active: true },
    [["sort", "ASC"]],
    ["id", "name"],
    null
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, projects));
  }
};

const handleGetOrganizationProject = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(EP_ProjectRole, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateProject = async (req, res) => {
  let data = req.body;

  let [project, error] = await create(EP_ProjectRole, data);
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Project id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, project));
  }
};

const handleGetUpdatProject = async (req, res) => {
  let { organization_id, id } = req.params;

  let [project, error] = await update(EP_ProjectRole, req.body, {
    organization_id,
    id,
  });
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Project id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, project));
  }
};

const handleGetProjectRoleDropdown = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_ProjectRole,
    { organization_id },

    [["sort", "ASC"]],
    ["id", "name", "color", "sort", "active"]
  );

  console.log(error);
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleCreateProjectRole = async (req, res) => {
  const { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await create(EP_ProjectRole, {
    ...data.values,
    organization_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleUpdateProjectRole = async (req, res) => {
  const { organization_id } = req.params;

  let { values } = req.body;
  let { id, ...rest } = values;

  let [response, error] = await update(
    EP_ProjectRole,
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

  let [response, error] = await bulkCreate(EP_ProjectRole, data, null, {
    updateOnDuplicate: ["sort", "updatedAt"],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleDeleteProjectRole = async (req, res) => {
  const { organization_id, id } = req.params;

  let [projectRoleCount, errorCount] = await count(EP_ProjectTeam, {
    organization_id,
    project_role_id: id,
  });

  if (projectRoleCount > 0) {
    return res.status(409).json({
      type: "cannot_be_deleted",
    });
  } else {
    let [response, error] = await destroy(
      EP_ProjectRole,
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
  handleGetAllOrganizationProject,
  handleGetAllOrganizationProjectDropdown,
  handleGetOrganizationProject,
  handleCreateProject,
  handleGetUpdatProject,
  handleGetProjectRoleDropdown,
  handleCreateProjectRole,
  handleUpdateProjectRole,
  handleUpdateSort,
  handleDeleteProjectRole,
};
