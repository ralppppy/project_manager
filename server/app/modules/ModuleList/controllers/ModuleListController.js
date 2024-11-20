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
  count,
} = require(path.resolve("app", "common", "services", "CommonServices.js"));
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const {
  EP_Client,
  EP_Project,
  EP_Module,
  EP_ProjectTeam,
  EP_ModuleTeam,
  EP_Organization,
  EP_TasksTeam,
  EP_TasksStatus,
  EP_TaskCompletionSetting,
  EP_Task,
} = require(path.resolve("database", "models"));
const {
  deleteModuleTeamMember,
  deleteDuplicateTeamMember,
  deleteModuleTeamMemberProject,
} = require(path.resolve(
  "app",
  "modules",
  "ModuleList",
  "services",
  "ModuleListServices"
));

const handleGetModuleList = async (req, res) => {
  let { organization_id, client_id, project_id } = req.params;
  let { paginate, search } = req.query;
  let user = req.user;

  let filter = {
    organization_id,
    client_id: parseInt(client_id),
    project_id: parseInt(project_id),
    name: { [Op.like]: `%${search}%` },
  };
  if (client_id.includes("All")) {
    delete filter.client_id;
  }
  if (project_id.includes("All")) {
    delete filter.project_id;
  }

  try {
    let [completeStatusId, _] = await getOne(
      EP_TaskCompletionSetting,
      { organization_id },
      ["id", "task_status_id"]
    );

    let task_status_id = completeStatusId
      ? completeStatusId?.task_status_id
      : -1;

    let [data, error] = await get(
      EP_Module,
      filter,
      [["updatedAt", "DESC"]],
      [
        "id",
        "client_id",
        "project_id",
        "organization_id",
        "name",
        "active",
        [
          sequelize.literal(
            "(SELECT COUNT(*) FROM EP_Tasks WHERE EP_Tasks.module_id = EP_Module.id)"
          ),
          "total_tasks",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(CASE WHEN task_status_id = ${task_status_id} THEN 1 ELSE NULL END) FROM EP_Tasks WHERE EP_Tasks.module_id = EP_Module.id)`
          ),
          "completed_task",
        ],
        "description",
        "createdAt",
        "updatedAt",
      ],
      paginate,
      {
        include: [
          {
            association: EP_Module.team,
            attributes: ["id"],
            include: [
              {
                association: EP_ModuleTeam.project_role,
                attributes: ["id", "name"],
              },
              {
                required: true,
                association: EP_ModuleTeam.user,
                attributes: ["id", "first_name", "last_name"],
              },
            ],
          },

          {
            association: EP_Module.module_team_emtpy,
            attributes: [],
            where: {
              user_id: user.id,
            },
            required: true,
          },
          {
            association: EP_Module.project,
            attributes: ["id", "client_id", "name"],
          },
        ],
      },
      {
        include: [
          {
            association: EP_Module.module_team_emtpy,
            attributes: [],
            where: {
              user_id: user.id,
            },
            required: true,
          },
        ],
      }
    );

    let moduleList = data?.data.map((moduleItem, idx) => {
      return {
        title: moduleItem.name,
        subTitle: moduleItem.project.name,
        project_id: moduleItem.project.id,
        client_id: moduleItem.project.client_id,
        description: moduleItem.description,
        key: moduleItem.id,
        id: moduleItem.id,
        active: moduleItem?.active,
        total_tasks: moduleItem?.dataValues?.total_tasks,
        completed_tasks: moduleItem?.dataValues?.completed_task,
        developers: moduleItem.team.map((team) => {
          return {
            id: team?.user.id,
            first_name: team?.user.first_name,
            last_name: team?.user.last_name,
            projectRoleName: team?.project_role.name,
            projectRoleId: team?.project_role.id,
          };
        }),
        date_started: moduleItem.createdAt,
      };
    });
    res.json(
      formatResponse(true, { data: moduleList, totalData: data?.totalData })
    );
  } catch (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  }
};

const handleDeleteModuleTeamMember = async (req, res) => {
  let { module_team_id, organization_id } = req.params;

  let [response, error] = await deleteModuleTeamMember(module_team_id);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleDeleteModuleTeamMemberProject = async (req, res) => {
  let { project_team_id, organization_id } = req.params;

  let [response, error] = await deleteModuleTeamMemberProject(project_team_id);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetTeam = async (req, res) => {
  let { module_id, client_id, project_id, organization_id } = req.params;

  let TeamTable = !isNaN(module_id) ? EP_ModuleTeam : EP_ProjectTeam;

  module_id = isNaN(module_id) ? {} : { module_id };
  let [team, error] = await get(
    TeamTable,
    {
      client_id,
      project_id,
      organization_id,
      ...module_id,
    },
    null,
    ["id", "user_id", "project_role_id"],
    null,
    {
      include: [
        {
          association: TeamTable.user,
          attributes: ["id", "first_name", "last_name"],
        },
        {
          association: TeamTable.project_role,
          attributes: ["id", "name"],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, team));
  }
};

const getDataIfModuleIsSelected = async ({
  module_id,
  client_id,
  project_id,
}) => {
  let [[moduleList, error]] = await Promise.all([
    getOne(
      EP_Module,
      {
        id: module_id,
        client_id: parseInt(client_id),
        project_id: parseInt(project_id),
      },
      ["id", "name", "description", "active", "createdAt"],

      {
        include: [
          {
            association: EP_Module.team,
            attributes: ["id"],
            include: [
              {
                association: EP_ModuleTeam.project_team,
                attributes: ["id", "project_role_id"],
                include: [
                  {
                    association: EP_ProjectTeam.user,
                    attributes: ["id", "first_name", "last_name"],
                  },
                  {
                    association: EP_ProjectTeam.project_role,
                    attributes: ["name"],
                  },
                ],
              },
              {
                association: EP_ModuleTeam.project_role,
                attributes: ["id", "name"],
              },
              {
                association: EP_ModuleTeam.user,
                attributes: ["id", "first_name", "last_name"],
              },
            ],
          },
          {
            association: EP_Module.project,
            attributes: ["id", "client_id", "name"],
            include: [
              {
                association: EP_Project.client,
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      }
    ),
  ]);
  return [[moduleList, error]];
};

const getDataIfMouduleIsAll = async ({ module_id, client_id, project_id }) => {
  let [[moduleList, error]] = await Promise.all([
    getOne(
      EP_Project,
      { id: project_id, client_id },
      [
        "id",
        "name",
        [
          sequelize.literal(
            `CASE WHEN COUNT(modules.id) > 0 THEN TRUE ELSE FALSE END`
          ),
          // sequelize.literal(
          //   `COUNT(CASE WHEN task_status_id = ${task_status_id} THEN 1 ELSE NULL END)`
          // ),
          "active",
        ],
        "createdAt",
      ],
      {
        include: [
          {
            association: EP_Project.team,

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
          {
            association: EP_Project.client,
            attributes: ["id", "name"],
          },
          {
            required: false,
            association: EP_Project.modules,
            where: {
              active: true,
            },
            attributes: [],
          },
        ],
      }
    ),
  ]);

  return [[moduleList, error]];
};

const getDataIfProjectIsAll = async ({ client_id }) => {
  let [[moduleList, error]] = await Promise.all([
    getOne(EP_Client, { id: client_id }, ["id", "name", "createdAt"], {
      group: ["EP_Client.id", "team.user_id"],
      include: [
        {
          association: EP_Client.team,

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
    }),
  ]);

  return [[moduleList, error]];
};

const getDataIfClientIsAll = async ({ organization_id }) => {
  let [[moduleList, error]] = await Promise.all([
    await getOne(
      EP_Organization,
      { id: parseInt(organization_id) },
      ["id", "name", "createdAt"],
      {
        group: ["EP_Organization.id", "team.user_id"],
        include: [
          {
            association: EP_Organization.team,

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
    ),
  ]);

  return [[moduleList, error]];
};

const handleGetSingleModule = async (req, res) => {
  let { module_id, client_id, project_id, organization_id } = req.params;

  // await handleCount(req.params);
  let user = req.user;
  // console.log(user);

  let isEmployee = user.is_employee;

  let data, error;

  if (isNaN(client_id)) {
    if (client_id.toLowerCase().includes("all") && isEmployee) {
      let [[moduleList, error]] = await getDataIfClientIsAll({
        organization_id,
      });

      data = { ...moduleList?.dataValues };
      error = error;
    } else {
      //If client chosses All/All as a filter then get the project All instead
      let [[moduleList, error]] = await getDataIfProjectIsAll({
        module_id,
        client_id: user.client.client_id,
        project_id,
      });

      data = { ...moduleList?.dataValues };
      error = error;
    }
  }
  //If project filter is All
  else if (isNaN(project_id)) {
    if (project_id.toLowerCase().includes("all")) {
      let [[moduleList, error]] = await getDataIfProjectIsAll({
        module_id,
        client_id,
        project_id,
      });

      data = { ...moduleList?.dataValues };
      error = error;
    }
  } else {
    //User selected All in module filter
    if (isNaN(module_id)) {
      if (module_id.toLowerCase().includes("all")) {
        let [[moduleList, error]] = await getDataIfMouduleIsAll({
          module_id,
          client_id,
          project_id,
        });
        data = { ...moduleList?.dataValues };
        error = error;
      }
    } else {
      let [[moduleList, error]] = await getDataIfModuleIsSelected({
        module_id,
        client_id,
        project_id,
      });
      data = { ...moduleList?.dataValues };
      error = error;
    }
  }
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, data));
  }
};

const handleGetSingleModuleTaskCountComparison = async (req, res) => {
  let { module_id, client_id, project_id, organization_id } = req.params;
  let { isFeedback } = req.query;
  let user = req.user;

  isFeedback = isFeedback === "true";

  let isEmployee = user.is_employee;

  let [completeStatusId, _] = await getOne(
    EP_TaskCompletionSetting,
    { organization_id },
    ["id", "task_status_id"]
  );

  let taskCountComparison = { start: 0, end: 0 };

  task_status_id = completeStatusId ? completeStatusId?.task_status_id : -1;

  let buildWhere = {};

  if (isNaN(client_id)) {
    if (client_id.toLowerCase().includes("all") && isEmployee) {
      buildWhere = { organization_id: parseInt(organization_id) };
    } else {
      buildWhere = { client_id: parseInt(user.client.client_id) };
    }
  }
  //If project filter is All
  else if (isNaN(project_id)) {
    if (project_id.toLowerCase().includes("all")) {
      buildWhere = { client_id: parseInt(client_id) };
    }
  } else {
    //User selected All in module filter
    if (isNaN(module_id)) {
      if (module_id.toLowerCase().includes("all")) {
        buildWhere = {
          client_id: parseInt(client_id),
          project_id: parseInt(project_id),
        };
      }
    } else {
      buildWhere = {
        module_id: parseInt(module_id),
        client_id: parseInt(client_id),
        project_id: parseInt(project_id),
      };
    }
  }

  let isFeedbackWhere = {};

  if (isEmployee) {
    isFeedbackWhere = isFeedback
      ? { is_feedback: true }
      : { is_feedback: false };
  }

  let [taskCountComparisonResponse, error] = await getOne(
    EP_Task,
    {
      ...buildWhere,
      ...isFeedbackWhere,
    },
    [
      [
        sequelize.literal(
          `COUNT(CASE WHEN task_status_id = ${task_status_id} THEN 1 ELSE NULL END)`
        ),
        "start",
      ],
      [sequelize.literal("COUNT(*)"), "end"],
    ],
    {
      raw: true,
    }
  );

  taskCountComparison = taskCountComparisonResponse;

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, taskCountComparison));
  }
};

const handleCountTotalAndWorkedHours = async (req, res) => {
  let { module_id, client_id, project_id, organization_id } = req.params;
  let { isFeedback } = req.query;
  // await handleCount(req.params);
  let user = req.user;
  // console.log(user);

  isFeedback = isFeedback === "true";
  let isEmployee = user.is_employee;

  let buildWhere = {};

  if (isNaN(client_id)) {
    if (client_id.toLowerCase().includes("all") && isEmployee) {
      buildWhere = { organization_id: parseInt(organization_id) };
    } else {
      buildWhere = { client_id: parseInt(user.client.client_id) };
    }
  }
  //If project filter is All
  else if (isNaN(project_id)) {
    if (project_id.toLowerCase().includes("all")) {
      buildWhere = { client_id: parseInt(client_id) };
    }
  } else {
    //User selected All in module filter
    if (isNaN(module_id)) {
      if (module_id.toLowerCase().includes("all")) {
        buildWhere = {
          client_id: parseInt(client_id),
          project_id: parseInt(project_id),
        };
      }
    } else {
      buildWhere = {
        module_id: parseInt(module_id),
        client_id: parseInt(client_id),
        project_id: parseInt(project_id),
      };
    }
  }

  let isFeedbackWhere = {};
  if (isEmployee) {
    isFeedbackWhere = isFeedback
      ? { is_feedback: true }
      : { is_feedback: false };
  }

  let [taskHours, error] = await get(
    EP_Task,
    {
      ...buildWhere,
      ...isFeedbackWhere,
    },
    null,
    [
      [
        sequelize.literal("COALESCE(SUM(timelog_data.hours_worked), 0)"),
        "total_hours_worked",
      ],
      [
        sequelize.literal(`SUM(COALESCE(time_estimate, 0))`),
        "total_time_estimate",
      ],
    ],

    null,

    {
      raw: true,
      include: [
        {
          association: EP_Task.timelog_data,
          required: false,

          attributes: [],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, taskHours));
  }
};

const handleCreateModule = async (req, res) => {
  let data = req.body;

  let [module, error] = await create(EP_Module, data, null, {
    include: [
      {
        association: EP_Module.team,
      },
    ],
  });

  if (error) {
    console.log(error);
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, `Module name must be unique.`));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, module));
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

const handleGetAllOrganizationProjectDropdown = async (req, res) => {
  let { organization_id } = req.params;
  let { client_id } = req.query;

  // let whereClause =
  //   client_id > 0 ? { organization_id, client_id } : { organization_id };

  let [projects, error] = await get(
    EP_Project,
    { organization_id, client_id: isNaN(client_id) ? 0 : client_id },
    null,
    ["id", "name"],
    null
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, projects));
  }
};

const handleGetUserDropdown = async (req, res) => {
  let { organization_id } = req.params;
  let { project_id, excludeUsers } = req.query;
  if (excludeUsers) {
    excludeUsers = excludeUsers.map((c) => parseInt(c));
  } else {
    excludeUsers = [];
  }
  let [users, error] = await get(
    EP_Project,
    { organization_id, id: isNaN(project_id) ? 0 : project_id },
    null,
    ["id"],
    null,
    {
      include: [
        {
          association: EP_Project.teams_users,
          attributes: ["id", "project_role_id", "user_id"],
          where: {
            user_id: {
              [Op.notIn]: excludeUsers,
            },
          },
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

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleUpdateModuleList = async (req, res) => {
  let { id } = req.params;
  let { team } = req.body;

  let [moduleList, error] = await update(EP_Module, req.body, {
    id,
  });

  if (team) {
    let [teams, error] = await bulkCreate(EP_ModuleTeam, team);
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
    res.json(formatResponse(true, moduleList));
  }
};

const handleGetGanttChartModules = async (req, res) => {
  let { organization_id, client_id, project_id } = req.params;

  let { startDate, endDate, modulesDropdownFilter } = req.query;

  let [clients, error] = await get(
    EP_Module,
    {
      organization_id,
      client_id,
      project_id,
      id: modulesDropdownFilter || [],
    },
    null,
    [
      "id",
      ["name", "title"],
      // [
      //   sequelize.literal(
      //     "COALESCE(SUM(DATEDIFF(end_date, start_date) + 1), 0)"
      //   ),
      //   "durationInDays",
      // ],
    ],
    null,
    {
      include: [
        {
          separate: true,
          association: EP_Module.children,
          as: "children",
          group: ["id"],
          attributes: [
            "id",
            "module_id",
            ["task_title", "title"],
            "instruction",
            [
              sequelize.literal(
                "COALESCE(DATEDIFF(gantt_chart_data.end_date, gantt_chart_data.start_date) + 1, 0)"
              ),
              "durationInDays",
            ],

            [
              sequelize.literal("COALESCE(SUM(timelog_data.hours_worked), 0)"),
              "hours_worked",
            ],

            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.fn(
                  "MIN",
                  sequelize.col("gantt_chart_data.start_date")
                ),
                "%m-%d-%Y"
              ),
              "startDate",
            ],
            [
              sequelize.fn(
                "DATE_FORMAT",
                sequelize.fn(
                  "DATE_ADD",
                  sequelize.fn(
                    "MAX",
                    sequelize.col("gantt_chart_data.end_date")
                  ),
                  sequelize.literal("INTERVAL 1 DAY")
                ),
                "%m-%d-%Y"
              ),
              "endDate",
            ],
          ],
          where: {
            connected_to_id: {
              [Op.is]: null,
            },
          },
          include: [
            {
              association: EP_Task.timelog_data,
              required: false,

              attributes: [],
            },
            {
              separate: true,
              group: ["id"],
              association: EP_Task.children,
              attributes: [
                "id",
                "module_id",
                ["task_title", "title"],
                "instruction",
                "hours_worked",
                [
                  sequelize.literal(
                    "COALESCE(DATEDIFF(end_date, start_date) + 1, 0)"
                  ),
                  "durationInDays",
                ],

                [
                  sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.fn(
                      "MIN",
                      sequelize.col("gantt_chart_data.start_date")
                    ),
                    "%m-%d-%Y"
                  ),
                  "startDate",
                ],
                [
                  sequelize.fn(
                    "DATE_FORMAT",
                    sequelize.fn(
                      "DATE_ADD",
                      sequelize.fn(
                        "MAX",
                        sequelize.col("gantt_chart_data.end_date")
                      ),
                      sequelize.literal("INTERVAL 1 DAY")
                    ),
                    "%m-%d-%Y"
                  ),
                  "endDate",
                ],
              ],

              include: [
                {
                  required: false,
                  association: EP_Task.gantt_chart_data,
                  attributes: [],
                },
              ],
            },
            {
              required: false,
              association: EP_Task.gantt_chart_data,
              attributes: [],
              where: {
                [sequelize.Op.and]: [
                  {
                    start_date: {
                      [sequelize.Op.gte]: startDate,
                    },
                  },
                  {
                    end_date: {
                      [sequelize.Op.lte]: endDate,
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

const handleGetModuleListDropdown = async (req, res) => {
  let { organization_id, client_id, project_id } = req.params;

  let [data, error] = await get(
    EP_Module,
    {
      organization_id,
      client_id,
      project_id,
    },
    null,
    ["id", ["id", "value"], ["name", "label"]]
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, data));
  }
};

module.exports = {
  handleGetAllOrganizationClientDropdown,
  handleGetAllOrganizationProjectDropdown,
  handleCreateModule,
  handleGetUserDropdown,
  handleGetModuleList,
  handleGetSingleModule,
  handleDeleteModuleTeamMember,
  handleUpdateModuleList,
  handleDeleteModuleTeamMemberProject,
  handleGetTeam,
  handleGetGanttChartModules,
  handleGetModuleListDropdown,
  handleGetSingleModuleTaskCountComparison,
  handleCountTotalAndWorkedHours,
};
