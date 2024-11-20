const path = require("path");
const sequelize = require("sequelize");
const Op = require("sequelize").Op;

const { get, getOne, create, bulkCreate, update, count } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const {
  EP_Project,
  EP_ProjectTeam,
  EP_ProjectVersion,
  EP_Client,
  EP_Module,
} = require(path.resolve("database", "models"));
const {
  getProjectDetails,
  deleteTeamMember,
  deleteVersion,
} = require(path.resolve(
  "app",
  "modules",
  "Project",
  "services",
  "ProjectServices"
));

const handleGetAllOrganizationProject = async (req, res) => {
  let { organization_id } = req.params;
  let { paginate, sort, search, filter } = req.query;

  // filter = { active: true, assingedProject: true };

  let pagingation = {
    ...paginate,
  };

  let sortFormat = {
    descend: "DESC",
    ascend: "ASC",
  };

  let searchData = {};
  let searchDataClient = {};

  filter = {
    ...filter,
    active: filter.active === "true",
    assignedProjects: filter.assignedProjects === "true",
  };

  if (search.searchIndex === "client") {
    if (search.s) {
      searchDataClient = {
        where: {
          name: {
            [Op.like]: `%${search.s}%`,
          },
        },
      };
    }
  } else {
    if (search.s) {
      searchData = {
        [search.searchIndex]: {
          [Op.like]: `%${search.s}%`,
        },
      };
    }
  }

  let sorter = [["sort", "ASC"]];
  if (sort.field === "client") {
    if (search.searchIndex === "client") {
      sorter = [["sort", "ASC"]];
    } else {
      sorter = [
        ["sort", "ASC"],
        [EP_Project.client, "name", sortFormat[sort.order]],
      ];
    }
  } else {
    sorter = [
      ["sort", "ASC"],
      [sort.field, sortFormat[sort.order]],
    ];
  }

  let onlyMe = filter.assignedProjects
    ? {
        where: { user_id: filter.user_id },
      }
    : {};

  let [projects, error] = await get(
    EP_Project,
    {
      organization_id,
      ...searchData,
      active: filter.active,
    },
    sorter,
    [
      "id",
      "name",
      "project_id_text",
      "organization_id",
      "sort",
      "active",
      "createdAt",
    ],
    pagingation,
    {
      include: [
        {
          association: EP_Project.team,
          attributes: ["id"],
          separate: true,
          required: false,
          include: [
            {
              association: EP_ProjectTeam.user,
              attributes: ["id", "first_name", "last_name"],
            },
            {
              association: EP_ProjectTeam.project_role,
              attributes: ["id", "name"],
            },
          ],
        },
        {
          association: EP_Project.teams_users,
          attributes: [],
          // required: true,
          require: false,

          ...onlyMe,
        },
        {
          association: EP_Project.versions,
          attributes: ["id", "name"],
        },
        {
          association: EP_Project.client,
          attributes: ["id", "name"],
          ...searchDataClient,
        },
      ],
    },
    {
      include: [
        {
          association: EP_Project.team,
          attributes: [],
          ...onlyMe,
        },
        {
          association: EP_Project.client,
          attributes: [],
          ...searchDataClient,
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, projects));
  }
};

const handleGetOrganizationProject = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(EP_Project, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateProject = async (req, res) => {
  let data = req.body;

  let [client, error] = await create(EP_Project, data, null, {
    include: [
      {
        association: EP_Project.team,
      },
      {
        association: EP_Project.versions,
      },
    ],
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(
          formatResponse(
            false,
            null,
            `Project id and Project name must be unique.`
          )
        );
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, client));
  }
};

const handleUpdateProject = async (req, res) => {
  let { organization_id, id } = req.params;

  //If the use change the status of the project then check if this project is valid for closing
  if (req.body.hasOwnProperty("active")) {
    let { active } = req.body;
    if (!active) {
      let [projectModuleCount, projectModuleError] = await count(EP_Module, {
        organization_id,
        project_id: id,
        active: true,
      });

      if (projectModuleCount > 0) {
        return res
          .status(403)
          .send(
            formatResponse(
              false,
              null,
              "Project cannot be set to disabled because of active modules.",
              null,
              "not_allowed"
            )
          );
      }
    }
  }

  let [client, error] = await update(EP_Project, req.body, {
    organization_id,
    id,
  });

  if (req.body.team) {
    let [team, error] = await bulkCreate(EP_ProjectTeam, req.body.team);
  }
  if (req.body.versions) {
    let [team, error] = await bulkCreate(EP_ProjectVersion, req.body.versions);
  }

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(
          formatResponse(
            false,
            null,
            `Project id and Project name must be unique.`
          )
        );
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, client));
  }
};

const handleGetProjectDetails = async (req, res) => {
  let { organization_id } = req.params;
  let [details, error] = await getProjectDetails(organization_id);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, details));
  }
};

const handleDeleteProjectTeamMember = async (req, res) => {
  let { user_team_id, organization_id } = req.params;

  let [response, error] = await deleteTeamMember(user_team_id);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleDeleteProjectVersion = async (req, res) => {
  let { project_version_id, organization_id } = req.params;

  let [response, error] = await deleteVersion(project_version_id);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleSingleProjectSummary = async (organization_id, project_id) => {
  let [response, error] = await getOne(
    EP_Project,
    { id: project_id, organization_id },
    ["id", "name", "createdAt"],
    {
      include: [
        {
          association: EP_Project.teams_users,
          attributes: ["id"],
          include: [
            {
              association: EP_ProjectTeam.user,
              attributes: ["id", "first_name", "last_name"],
            },
            {
              association: EP_ProjectTeam.project_role,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    }
  );

  return [response, error];
};

const formatAllClientSummaryData = (data) => {
  let users = {};
  teams_users = [];
  data.forEach((client) => {
    client.projects.forEach((project) => {
      project.teams_users.forEach((user) => {
        users[user.user.id] = user.dataValues;
      });
    });
  });

  Object.keys(users).forEach((key) => {
    teams_users.push(users[key]);
  });

  return { teams_users };
  return { data, users };
  // let teams_users = [];

  // let users = {};

  // data.projects.forEach((d) => {
  //   d.team.forEach((c) => {
  //     users[c.user.id] = {
  //       id: c.id,
  //       user: c.user.dataValues,
  //       project_role: c.project_role.dataValues,
  //     };
  //   });
  // });

  // Object.keys(users).forEach((key) => {
  //   teams_users.push(users[key]);
  // });

  // delete data.dataValues.projects;

  // return { ...data.dataValues, teams_users };
};

const handleAllClientProjectSummary = async (organization_id, client_id) => {
  let [response, error] = await getOne(
    EP_Client,
    { id: client_id, organization_id },
    ["id", "name", "active", "createdAt"],
    {
      group: ["EP_Client.id", "teams_users.user_id"],
      include: [
        {
          association: EP_Client.teams_users,
          attributes: ["id", "user_id"],

          include: [
            {
              association: EP_ProjectTeam.user,
              attributes: ["id", "first_name", "last_name"],
            },
            {
              association: EP_ProjectTeam.project_role,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    }
  );
  return [response, error];
};
const handleAllClientSummary = async (organization_id, client_id) => {
  let [response, error] = await get(
    EP_Client,
    { organization_id },
    null,
    ["id", "name", "active", "createdAt"],
    null,
    {
      include: [
        {
          association: EP_Client.projects,
          attributes: ["id", "name", "active", "createdAt"],
          include: [
            {
              association: EP_Client.teams_users,
              attributes: ["id", "user_id"],

              include: [
                {
                  association: EP_ProjectTeam.user,
                  attributes: ["id", "first_name", "last_name"],
                },
                {
                  association: EP_ProjectTeam.project_role,
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
        },
      ],
    }
  );

  response = formatAllClientSummaryData(response);
  return [response, error];
};

const handleGetProjectSummary = async (req, res) => {
  let { project_id, client_id, organization_id } = req.params;

  if (isNaN(client_id)) {
    let [response, error] = await handleAllClientSummary(
      organization_id,
      client_id
    );

    if (error) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, response));
    }
  } else {
    if (!isNaN(project_id)) {
      let [response, error] = await handleSingleProjectSummary(
        organization_id,
        project_id
      );

      if (error) {
        res.json(formatResponse(false, null));
      } else {
        res.json(formatResponse(true, response));
      }
    } else {
      let [response, error] = await handleAllClientProjectSummary(
        organization_id,
        client_id
      );
      if (error) {
        res.json(formatResponse(false, null));
      } else {
        res.json(formatResponse(true, response));
      }
    }
  }
};

const handleGetSinglProjectTaskCountComparison = async (req, res) => {
  let { project_id, client_id, organization_id } = req.params;

  let buildWhere = {};

  if (isNaN(client_id)) {
    buildWhere = { organization_id };
  } else {
    if (!isNaN(project_id)) {
      buildWhere = { project_id, organization_id };
    } else {
      buildWhere = { client_id, organization_id };
    }
  }

  let [moduleCountComparisonResponse, error] = await getOne(
    EP_Module,
    {
      ...buildWhere,
    },
    [
      [
        sequelize.literal(`COUNT(CASE WHEN active = 0 THEN 1 ELSE NULL END)`),
        "completed",
      ],
      [sequelize.literal(`COUNT(*)`), "total"],
    ],
    {
      raw: true,
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, moduleCountComparisonResponse));
  }
};

const handleGetAllOrganizationProjectDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [projects, error] = await get(
    EP_Project,
    { organization_id },
    [
      ["sort", "ASC"],
      ["createdAt", "DESC"],
    ],
    ["id", "name", "sort"],
    null,
    {
      include: [
        {
          association: EP_Project.client,
          attributes: ["id", "name"],
        },
      ],
    }
  );
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, projects));
  }
};

const handleUpdatetProjectSorting = async (req, res) => {
  let { organization_id } = req.params;

  let data = req.body;

  let [response, error] = await bulkCreate(
    EP_Project,
    data,
    ["id", "name", "sort"],
    {
      updateOnDuplicate: ["sort"],
      include: [
        {
          association: EP_Project.client,
          attributes: ["id", "name"],
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

module.exports = {
  handleGetAllOrganizationProject,
  handleGetOrganizationProject,
  handleCreateProject,
  handleUpdateProject,
  handleGetProjectDetails,
  handleDeleteProjectTeamMember,
  handleDeleteProjectVersion,
  handleGetAllOrganizationProjectDropdown,
  handleUpdatetProjectSorting,
  handleGetProjectSummary,
  handleGetSinglProjectTaskCountComparison,
};
