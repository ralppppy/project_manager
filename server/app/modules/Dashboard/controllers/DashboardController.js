const path = require("path");
const sequelize = require("sequelize");
const Op = require("sequelize").Op;
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const { get, getOne } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));
const {
  EP_Department,
  EP_Employee,
  EP_User,
  EP_TaskCompletionSetting,
  EP_Project,
  EP_ProjectTeam,
  EP_TasksTeam,
  EP_Task,
  EP_Client,
  EP_Timelog,
} = require(path.resolve("database", "models"));

const buildTasklistPopoverData = ({ data, user_id }) => {
  const result = [];
  for (const project of data) {
    for (const task of project.tasks) {
      const userFound = task.team.some(
        (teamMember) => teamMember.user_id === parseInt(user_id)
      );
      if (userFound) {
        result.push(task);
      }
    }
  }

  return result;
};

const buildChartDataset = ({ usersData, projects }) => {
  const seconds = 3600 * 8; // 3600 seconds in 1 hour, 8 is for the number of hours per day

  const datasets = [];

  projects.forEach((project) => {
    const existingDataset = datasets.find((d) => d.id === project.id);

    if (!existingDataset) {
      const data = Array(usersData.length).fill(0);

      usersData.forEach((user, idx) => {
        if (user.id === project["tasks.team.user.id"]) {
          const hours = project["tasks.time_estimate"] / seconds;
          data[idx] += hours; // divide to 28800 to convert seconds to hours
        }
      });
      datasets.push({
        id: project.id,
        label: JSON.stringify(project || {}),
        // label: project || {},
        data: data.map((value) => value),
        // data: data.map((value) => value),
      });
    } else {
      usersData.forEach((user, idx) => {
        if (user.id === project["tasks.team.user.id"]) {
          const hours = project["tasks.time_estimate"] / seconds;
          existingDataset.data[idx] += hours; // divide to 28800 to convert seconds to hours
        }
      });
    }
  });

  return datasets;
};

const handleGetChartData = async (req, res) => {
  const { organization_id } = req.params;

  let [status, erroStatus] = await getOne(
    EP_TaskCompletionSetting,
    {
      organization_id,
    },
    null,
    ["task_status_id"]
  );

  let [usersData, errorUsers] = await get(
    EP_User,
    { organization_id, is_active: true, is_employee: true },
    null,
    [
      "id",
      [sequelize.literal("CONCAT(`last_name`,', ', `first_name`)"), "name"],
    ],
    null,
    {
      order: [["name", "ASC"]],
      group: ["id", "projectTeams.project_id", "projectTeams.project.tasks.id"],
      include: [
        {
          association: EP_User.projectTeams,
          attributes: ["project_id"],
          include: [
            {
              required: true,
              association: EP_ProjectTeam.project,
              attributes: ["id"],

              include: [
                {
                  required: true,
                  association: EP_Project.tasks,
                  attributes: ["id"],
                  where: {
                    task_status_id: {
                      [sequelize.Op.not]: status.task_status_id,
                    },
                  },

                  include: [
                    {
                      required: true,
                      // separate: true,
                      association: EP_Task.timelog_data,

                      attributes: [
                        [
                          sequelize.fn(
                            "SUM",
                            sequelize.col(
                              "projectTeams.project.tasks.timelog_data.hours_worked"
                            )
                          ),
                          "total_hours_worked",
                        ],
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      // raw: true,
    }
  );

  // Calculate the overall_total based on the sum of total_hours_worked from the included associations
  usersData = usersData.map((user) => {
    const overall_total = user.projectTeams.map((projectTeam) => {
      const project = projectTeam.project;
      const total_hours_worked = project.tasks.reduce((hours, task) => {
        let timelog_hours_worked = parseInt(
          task.timelog_data[0].dataValues.total_hours_worked
        );
        return hours + (task.timelog_data ? timelog_hours_worked : 0);
      }, 0);

      return {
        project_id: project.id,
        total_hours_worked,
      };
    });
    return {
      id: user.id,
      name: user.dataValues.name,
      overall_total,
    };
  });

  let [projects, error] = await get(
    EP_Project,
    { organization_id, active: true },
    null,
    ["id", "project_id_text", "name"],
    null,
    {
      order: [[EP_Project.client, "client_id_text", "ASC"]],

      include: [
        {
          association: EP_Project.tasks,
          where: {
            task_status_id: {
              [sequelize.Op.not]: status.task_status_id,
            },
          },
          attributes: ["time_estimate", "id"],
          include: [
            {
              association: EP_Task.team,
              attributes: ["id"],
              include: [
                {
                  association: EP_TasksTeam.user,
                  attributes: [
                    "id",
                    [
                      sequelize.literal(
                        "CONCAT(`last_name`,', ', `first_name`)"
                      ),
                      "name",
                    ],
                  ],
                },
              ],
            },
          ],
        },
        {
          association: EP_Project.client,
          attributes: ["id", "client_id_text", "name"],
        },
      ],
      raw: true,
    }
  );

  const datasets = buildChartDataset({ usersData, projects });

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, { datasets, usersData }));
  }
};

const handleGetUnassignedProjects = async (req, res) => {
  const { organization_id } = req.params;

  let [response, error] = await get(
    EP_Project,
    { organization_id, active: true },
    null,
    ["id", "project_id_text", "name", ["updatedAt", "date_updated"]],
    null,
    {
      order: [[EP_Project.client, "client_id_text", "ASC"]],

      include: [
        {
          association: EP_Project.teams_users,
          required: false,
          where: {
            project_role_id: {
              [sequelize.Op.not]: 1,
            },
          },
        },
        {
          association: EP_Project.client,
          attributes: ["id", "name"],
        },
        {
          association: EP_Project.team,
          attributes: ["id"],
          separate: true,
          required: false,
          include: [
            {
              association: EP_ProjectTeam.user,
              attributes: [
                "id",
                [
                  sequelize.literal(
                    "CONCAT(`user`.`first_name`,' ', `user`.`last_name`)"
                  ),
                  "name",
                ],
              ],
            },
            {
              association: EP_ProjectTeam.project_role,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      where: sequelize.literal("`teams_users`.`project_role_id` IS NULL"),
    }
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetUnassignedTasks = async (req, res) => {
  const { organization_id } = req.params;

  let [status, erroStatus] = await getOne(
    EP_TaskCompletionSetting,
    {
      organization_id,
    },
    null,
    ["task_status_id"]
  );

  let [response, error] = await get(
    EP_Project,
    { organization_id, active: true },
    null,
    [
      "id",
      "project_id_text",
      "name",
      [
        sequelize.fn("SUM", sequelize.col("tasks.time_estimate")),
        "estimated_hours",
      ],

      [sequelize.fn("COUNT", sequelize.col("tasks.project_id")), "open_tasks"],
    ],
    null,
    {
      order: [[EP_Project.client, "client_id_text", "ASC"]],
      group: ["tasks.project_id"],
      include: [
        {
          required: true,
          association: EP_Project.tasks,
          attributes: [],
          where: {
            task_status_id: {
              [sequelize.Op.not]: status.task_status_id,
            },
            id: {
              [sequelize.Op.notIn]: sequelize.literal(
                "(SELECT `task_id` FROM `EP_TasksTeams`)"
              ),
            },
          },
        },
        {
          association: EP_Project.client,
          attributes: ["id", "client_id_text", "name"],
        },
      ],
    }
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetTasklistPopover = async (req, res) => {
  const { organization_id, user_id, project_id } = req.params;
  let [status, erroStatus] = await getOne(
    EP_TaskCompletionSetting,
    {
      organization_id,
    },
    null,
    ["task_status_id"]
  );

  let [response, error] = await get(
    EP_Project,
    { organization_id, active: true, id: project_id },
    null,
    ["id", "project_id_text", "name"],
    null,
    {
      // order: [[EP_Project.client, "client_id_text", "ASC"]],
      // group: ["tasks.project_id"],
      // raw: true,
      include: [
        {
          required: true,
          association: EP_Project.tasks,
          where: {
            task_status_id: {
              [sequelize.Op.not]: status.task_status_id,
            },
            project_id,
          },
          include: [
            {
              required: true,
              association: EP_Task.team,
              include: [
                {
                  association: EP_TasksTeam.user,
                  attributes: ["id", "first_name", "last_name"],
                },
                {
                  association: EP_TasksTeam.project_role,
                  attributes: ["id", "name"],
                },
              ],
            },
            {
              required: true,
              association: EP_Task.client,
              attributes: ["id", "name"],
            },
            {
              required: false,
              association: EP_Task.parent_task,
              attributes: ["id", "task_title"],
            },
            {
              required: true,
              association: EP_Task.project,
              attributes: ["id", "name"],
            },
            {
              required: true,
              association: EP_Task.task_type,
              attributes: ["id", "name", "color"],
            },
            {
              required: true,
              association: EP_Task.task_status,
              attributes: ["id", "name", "color"],
            },
            {
              required: true,
              association: EP_Task.task_priority,
              attributes: ["id", "name", "color"],
            },
            {
              required: true,
              association: EP_Task.creator,
              attributes: ["id", "first_name", "last_name"],
            },
            {
              required: false,
              association: EP_Task.timelog_data,
              attributes: ["id", "hours_worked"],
            },
          ],
        },
      ],
    }
  );

  response = buildTasklistPopoverData({ data: response, user_id });
  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};
const handleGetUserProjects = async (req, res) => {
  const { organization_id, user_id } = req.params;

  let [status, erroStatus] = await getOne(
    EP_TaskCompletionSetting,
    {
      organization_id,
    },
    null,
    ["task_status_id"]
  );

  let [response, error] = await get(
    EP_Project,
    { organization_id, active: true },
    null,
    [
      "id",
      "project_id_text",
      "name",
      [
        sequelize.fn("SUM", sequelize.col("tasks.time_estimate")),
        "remaining_hours",
      ],

      [sequelize.fn("COUNT", sequelize.col("tasks.project_id")), "open_tasks"],
    ],
    null,
    {
      order: [[EP_Project.client, "client_id_text", "ASC"]],
      group: ["tasks.project_id"],
      // raw: true,
      include: [
        {
          required: true,
          association: EP_Project.tasks,
          attributes: ["id"],
          where: {
            task_status_id: {
              [sequelize.Op.not]: status.task_status_id,
            },
          },
          include: [
            {
              required: true,
              association: EP_Task.team,
              attributes: [],
              where: {
                user_id,
              },
            },
            {
              separate: true,
              association: EP_Task.timelog_data,
              attributes: [
                [
                  sequelize.fn("SUM", sequelize.col("hours_worked")),
                  "hours_worked_individual",
                ],
              ],
              where: {
                user_id,
              },
              group: ["task_id", "user_id"],
            },
            {
              separate: true,
              association: EP_Task.timelog_data_project,
              // attributes: [
              //   sequelize.literal(
              //     "SUM(`tasks->timelog_data_project`.`hours_worked`) AS hours_worked_project"
              //   ),
              // ],
              attributes: [
                [
                  sequelize.fn("SUM", sequelize.col("hours_worked")),
                  "hours_worked_project",
                ],
              ],
              group: ["task_id"],
            },
          ],
        },
        {
          association: EP_Project.client,
          attributes: ["id", "client_id_text", "name"],
        },
      ],
    }
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetDepartments = async (req, res) => {
  const { organization_id } = req.params;

  let [status, erroStatus] = await getOne(
    EP_TaskCompletionSetting,
    {
      organization_id,
    },
    null,
    ["task_status_id"]
  );

  let [departments, error] = await get(
    EP_Department,
    {
      organization_id,
      active: true,
    },
    null,
    ["id", ["id", "key"], ["name", "title"]],
    null,
    {
      order: [
        ["id", "ASC"],
        [sequelize.literal("`children->user`.`last_name`"), "ASC"],
      ],
      group: ["id", "children.id"],
      include: [
        {
          required: false,
          association: EP_Department.children,
          include: [
            {
              required: false,
              association: EP_Employee.user,

              attributes: [
                "id",
                [
                  sequelize.literal(
                    "CONCAT(`children->user`.`last_name`, ', ', `children->user`.`first_name`)"
                  ),
                  "title",
                ],
                "id",
                [
                  sequelize.literal("CONCAT(EP_Department.id,'-',children.id)"),
                  "key",
                ],
                [
                  sequelize.fn(
                    "COUNT",
                    sequelize.col("children->user->taskTeams.id")
                  ),
                  "total_tasks",
                ],
              ],

              include: [
                {
                  association: EP_User.taskTeams,
                  attributes: [],
                  include: [
                    {
                      association: EP_TasksTeam.tasks,
                      where: {
                        task_status_id: {
                          [sequelize.Op.not]: status.task_status_id,
                        },
                      },
                      attributes: [],
                    },
                  ],
                },
              ],
            },
          ],
          attributes: ["id"],
        },
      ],
    }
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, departments));
  }
};

module.exports = {
  handleGetDepartments,
  handleGetUserProjects,
  handleGetUnassignedTasks,
  handleGetUnassignedProjects,
  handleGetChartData,
  handleGetTasklistPopover,
};
