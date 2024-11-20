// const UserService = require("../services/UserService");

// Example controller method
const path = require("path");
const sequelize = require("sequelize");
const utc = require("dayjs/plugin/utc");

const dayjs = require("dayjs");

dayjs.extend(utc);

const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));
const {
  EP_User,
  EP_Department,
  EP_Employee,
  EP_GanttChart,
} = require(path.resolve("database", "models"));

const { get, update, create, destroy } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));

const handleGetGanttChartData = async (req, res) => {
  let { organization_id, client_id, project_id } = req.params;
  let { startDate, endDate } = req.query;

  let [ganttChartData, error] = await get(
    EP_GanttChart,
    {
      organization_id,
      client_id,
      project_id,

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
    null,
    [
      "id",
      ["task_id", "resourceId"],
      ["start_date", "start"],
      ["end_date", "end"],
      "module_id",
      // [sequelize.literal("COALESCE('red', 'green')"), "color"],
      // [
      //   sequelize.literal(
      //     `
      //      CASE WHEN start_date < '${currentDate}' AND end_date < '${currentDate}' THEN 'red'
      //           ELSE
      //             CASE WHEN start_date < '${currentDate}' AND end_date > '${currentDate}' THEN 'orange'
      //             ELSE
      //              'green'
      //             END
      //           ELSE
      //           'green'
      //      END`
      //   ),
      //   "color",
      // ],
      // [
      //   sequelize.literal(
      //     `
      //     CASE
      //       WHEN start_date < '${currentDate}' AND end_date < '${currentDate}' THEN '#FF0000'
      //       WHEN start_date < '${currentDate}' AND end_date > '${currentDate}' THEN '#FFA500'
      //       ELSE '#008000'
      //     END
      //     `
      //   ),
      //   "color",
      // ],
      // [
      //   sequelize.literal(
      //     "CASE WHEN start_date < NOW() AND end_date < NOW() THEN 'red' ELSE 'green' END"
      //   ),
      //   "color",
      // ],
    ],
    null,
    {
      raw: true,

      include: [
        {
          association: EP_GanttChart.user,
          attributes: [
            sequelize.literal("CONCAT(last_name, ', ', first_name) as title"),
            sequelize.literal("user.id as user_id"),
          ],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, ganttChartData));
  }
};

const handleCreateGanttChartData = async (req, res) => {
  let data = req.body;

  let [ganttData, error] = await create(EP_GanttChart, data);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, ganttData));
  }
};

const handleUpdateGanttChartData = async (req, res) => {
  let { id } = req.params;

  let [ganttData, error] = await update(EP_GanttChart, req.body, { id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, ganttData));
  }
};

const handleGetSummary = async (req, res) => {
  let { organization_id, client_id, project_id } = req.params;

  let [ganttData, error] = await get(EP_GanttChart, {
    organization_id,
    client_id,
    project_id,
  });

  let [users, error1] = await get(
    EP_User,
    null,
    null,
    ["id", ["id", "key"], "first_name", "last_name"],
    null,
    {
      order: [
        ["last_name", "ASC"],
        [EP_User.gantt_chart_data, "start_date", "ASC"],
      ],

      include: [
        {
          required: true,
          association: EP_User.gantt_chart_data,
          attributes: ["id", ["id", "key"], "start_date", "end_date"],
          where: {
            organization_id,
            client_id,
            project_id,
          },

          include: [
            {
              required: true,
              association: EP_GanttChart.task,
              attributes: [
                "id",
                "task_title",
                "time_estimate",
                "hours_worked",
                // "instruction",
                "deadline",
              ],
            },
            {
              association: EP_GanttChart.module,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};
const handleGetUserDropdown = async (req, res) => {
  let { organization_id, client_id, project_id } = req.params;

  let [users, error] = await get(
    EP_User,
    null,
    null,
    [
      "id",
      ["id", "value"],
      [sequelize.literal("CONCAT(last_name, ', ', first_name)"), "label"],
      // sequelize.literal("CONCAT(last_name, ', ', first_name) as title"),
    ],
    null,
    {
      include: [
        {
          required: true,
          association: EP_User.gantt_chart_data,
          attributes: [],
          where: {
            organization_id,
            client_id,
            project_id,
          },

          include: [
            {
              required: true,
              association: EP_GanttChart.task,
              attributes: [],
            },
          ],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleGetDepartmentsWithUsers = async (req, res) => {
  let { organization_id } = req.params;

  let [departments, error] = await get(
    EP_Department,
    { organization_id },
    null,
    ["id", ["id", "key"], ["name", "title"]],
    null,
    {
      order: [["sort", "ASC"]],
      include: [
        {
          required: true,
          association: EP_Department.children,
          include: [
            {
              required: true,
              association: EP_Employee.user,
              attributes: [
                "id",
                [
                  sequelize.literal("CONCAT(last_name, ', ', first_name)"),
                  "title",
                ],
                "id",
                [
                  sequelize.literal("CONCAT(EP_Department.id,'-',children.id)"),
                  "key",
                ],
              ],
            },
          ],
          attributes: ["id"],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, departments));
  }
};

module.exports = {
  handleCreateGanttChartData,
  handleGetGanttChartData,
  handleUpdateGanttChartData,
  handleGetSummary,
  handleGetUserDropdown,
  handleGetDepartmentsWithUsers,
};
