const path = require("path");
const Op = require("sequelize").Op;
const sequelize = require("sequelize");
const utc = require("dayjs/plugin/utc");

const dayjs = require("dayjs");

dayjs.extend(utc);

const { get, create, update, destroy } = require(path.resolve(
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
  EP_Client,
  EP_Project,
  EP_Module,
  EP_TasksStatus,
  EP_Department,
  EP_Task,
  EP_Timelog,
  EP_Employee,
  EP_User,
} = require(path.resolve("database", "models"));

const handleDeleteTimelog = async (req, res) => {
  let { organization_id, timelog_id } = req.params;

  let [response, error] = await destroy(EP_Timelog, {
    organization_id,
    id: timelog_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleGetTimelogData = async (req, res) => {
  let { organization_id } = req.params;
  let { startDate, endDate } = req.query;

  let [timelogData, error] = await get(
    EP_Timelog,
    {
      organization_id,

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
      ["user_id", "resourceId"],
      ["start_date", "start"],
      ["end_date", "end"],
      "task_id",
      "hours_worked",
    ],
    null,
    {
      raw: true,
      include: [
        {
          association: EP_Timelog.task,
          attributes: [
            sequelize.literal(
              "CONCAT(`task`.`id`, ' - ', `task`.`task_title`) as title"
            ),
          ],
        },
      ],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, timelogData));
  }
};

const handleCreateTimelogData = async (req, res) => {
  let data = req.body;

  let { start_date, end_date, organization_id, user_id } = data;

  let startDate = dayjs.utc(start_date).startOf("day").toISOString();
  let endDate = dayjs.utc(end_date).endOf("day").toISOString();

  let [currentTimelog] = await get(
    EP_Timelog,
    {
      organization_id,
      user_id,
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
    ["id", "start_date", "end_date"],
    null,
    {
      raw: true,
    }
  );

  let overlapping = false;
  currentTimelog.map((c) => {
    const startNew = dayjs.utc(start_date).format("HH:mm");
    const endNew = dayjs.utc(end_date).format("HH:mm");
    const startCurrent = dayjs.utc(c.start_date).format("HH:mm");
    const endCurrent = dayjs.utc(c.end_date).format("HH:mm");

    if (startNew < endCurrent && endNew > startCurrent) {
      overlapping = true;
      return;
    }
  });

  let [timelogData, error] = await create(EP_Timelog, data);
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, timelogData));
  }
};

const handleUpdateTimelogData = async (req, res) => {
  let { id } = req.params;

  let [timelogData, error] = await update(EP_Timelog, req.body, { id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, timelogData));
  }
};

const handleGetStatusFilterSelect = async (req, res) => {
  let { organization_id } = req.params;

  let [taskStatus, error] = await get(
    EP_TasksStatus,
    { organization_id },
    null,
    [
      "id",
      "organization_id",
      ["id", "key"],
      ["id", "value"],
      ["name", "title"],
    ],
    null
  );
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, taskStatus));
  }
};
const handleGetUserTimelogResources = async (req, res) => {
  let { organization_id } = req.params;
  let { startDate, endDate } = req.query;

  let [resources, error] = await get(
    EP_Department,
    { organization_id },
    null,
    [
      ["id", "groupId"],
      // [sequelize.literal('CONCAT("dept", `EP_Department`.`id`)'), "id"],
      ["name", "title"],
    ],
    null,
    {
      group: ["groupId", "children.user_id"],
      include: [
        {
          required: true,
          raw: true,
          association: EP_Department.children,
          attributes: [
            [sequelize.literal("CONCAT(last_name, ', ', first_name)"), "title"],
            ["user_id", "id"],
            // "id",
          ],
          include: [
            {
              required: true,
              association: EP_Employee.user,
              attributes: [
                "id",
                [
                  sequelize.literal(`SUM(COALESCE(hours_worked, 0))`),
                  "hours_worked",
                ],
              ],

              include: [
                {
                  required: false,
                  association: EP_User.timelogs,
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
        },
      ],
    }
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, resources));
  }
};

const formatProjectWhere = (filter) => {
  let obj = {};
  let projectWhere = [];
  let moduleWhere = [];
  let projectWhereInclude = {};
  let moduleWhereInclude = {};

  if (!filter.includes("All")) {
    filter.forEach((c) => {
      if (c.includes("client")) {
        let [_, client_id] = c.split("_");
        obj[client_id] = [];
      }
    });

    filter.forEach((c) => {
      if (c.includes("project")) {
        let [client_id, _, project_id] = c.split("_");
        if (obj.hasOwnProperty(client_id)) {
          obj[client_id] = [...obj[client_id], project_id];
        } else {
          obj[client_id] = [project_id];
        }
      }
      if (c.includes("module")) {
        let [client_id, project_id, _, module_id] = c.split("_");
        if (obj.hasOwnProperty(client_id)) {
          obj[client_id] = [...obj[client_id], project_id];
        } else {
          obj[client_id] = [project_id];
        }
      }
    });

    for (let key of Object.keys(obj)) {
      if (obj[key].length === 0) {
        projectWhere.push({ client_id: key });
        moduleWhere.push({ client_id: key });
      } else {
        projectWhere.push({ client_id: key, id: obj[key] });
        moduleWhere.push({ client_id: key, project_id: obj[key] });
      }
    }

    filter.forEach((c) => {
      if (c.includes("module")) {
        let [client_id, project_id, _, module_id] = c.split("_");
        const newElement = { project_id, id: module_id };
        for (let i = 0; i < moduleWhere.length; i++) {
          const tempobj = moduleWhere[i];
          if (
            tempobj.project_id &&
            tempobj.project_id.includes(newElement.project_id)
          ) {
            if (Array.isArray(tempobj.project_id)) {
              tempobj.project_id = tempobj.project_id.filter(
                (id) => id !== newElement.project_id
              );
              if (tempobj.project_id.length === 0) {
                delete tempobj.project_id;
              }
            } else if (tempobj.project_id === newElement.project_id) {
              delete tempobj.project_id;
            }
          }
          if (
            moduleWhere[i].client_id === client_id &&
            !moduleWhere[i].project_id
          ) {
            moduleWhere.splice(i, 1);
          }
        }
        moduleWhere.push(newElement);
      }
    });

    projectWhereInclude = {
      where: { [Op.or]: projectWhere },
    };
    moduleWhereInclude = {
      where: { [Op.or]: moduleWhere },
    };

    return {
      projectWhereInclude,
      moduleWhereInclude,
    };
  }
};

const handleGetUserFilterTimelogTree = async (req, res) => {
  let { organization_id, user_id } = req.params;
  let { filter, filterDate } = req.query;

  if (typeof filter === "undefined") return res.json(formatResponse(true, []));
  let formatted = formatProjectWhere(filter);

  if (!filterDate.start) {
    filterDate.start = dayjs.utc().startOf("month").toISOString();
    filterDate.end = dayjs.utc().endOf("month").toISOString();
  }

  let [data, error] = await get(
    EP_Client,
    { organization_id, active: true },
    null,
    [
      [sequelize.literal('CONCAT("client_", `EP_Client`.`id`)'), "key"],
      [sequelize.literal('CONCAT("client_", `EP_Client`.`id`)'), "value"],
      "id",
      "organization_id",
      ["name", "title"],
    ],
    null,
    {
      include: [
        {
          required: true,
          association: EP_Client.children,
          ...formatted?.projectWhereInclude,
          attributes: [
            "id",
            [
              sequelize.literal(
                'CONCAT(`EP_Client`.`id`,"_project_", `children`.`id`)'
              ),
              "key",
            ],
            [
              sequelize.literal(
                'CONCAT(`EP_Client`.`id`,"_project_", `children`.`id`)'
              ),
              "value",
            ],
            ["name", "title"],
          ],

          include: [
            {
              required: true,
              association: EP_Project.children,
              ...formatted?.moduleWhereInclude,
              attributes: [
                "id",
                [
                  sequelize.literal(
                    'CONCAT(`EP_Client`.`id`,"_",`children`.`id`,"_module_", `children->children`.`id`)'
                  ),
                  "key",
                ],
                [
                  sequelize.literal(
                    'CONCAT(`EP_Client`.`id`,"_",`children`.`id`,"_module_", `children->children`.`id`)'
                  ),
                  "value",
                ],
                ["name", "title"],
              ],
              include: [
                {
                  required: true,
                  association: EP_Module.children,
                  attributes: [
                    "id",
                    "module_id",
                    "organization_id",
                    "client_id",
                    "project_id",
                    ["task_title", "title"],
                    "createdAt",
                    "task_status_id",
                  ],
                  where: {
                    // task_title: { [Op.like]: `%${search}%` },
                    [Op.and]: [
                      {
                        createdAt: {
                          [Op.gte]: filterDate.start,
                        },
                      },
                      {
                        createdAt: {
                          [Op.lte]: filterDate.end,
                        },
                      },
                    ],
                  },
                  include: [
                    {
                      association: EP_Task.team,
                      where: { user_id },
                      attributes: [],
                    },
                  ],
                },
              ],
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
    res.json(formatResponse(true, data));
  }
};

const handleGetUserTimelogTree = async (req, res) => {
  let { organization_id, user_id } = req.params;
  let { filterDate } = req.query;

  let [data, error] = await get(
    EP_Client,
    { organization_id, active: true },
    null,
    [
      [sequelize.literal('CONCAT("client_", `EP_Client`.`id`)'), "key"],
      [sequelize.literal('CONCAT("client_", `EP_Client`.`id`)'), "value"],
      "id",
      "organization_id",
      ["name", "title"],
    ],
    null,
    {
      include: [
        {
          required: true,
          association: EP_Client.children,
          attributes: [
            "id",
            [
              sequelize.literal(
                'CONCAT(`EP_Client`.`id`,"_project_", `children`.`id`)'
              ),
              "key",
            ],
            [
              sequelize.literal(
                'CONCAT(`EP_Client`.`id`,"_project_", `children`.`id`)'
              ),
              "value",
            ],
            ["name", "title"],
          ],

          include: [
            {
              required: true,
              association: EP_Project.children,
              attributes: [
                "id",
                [
                  sequelize.literal(
                    'CONCAT(`EP_Client`.`id`,"_",`children`.`id`,"_module_", `children->children`.`id`)'
                  ),
                  "key",
                ],
                [
                  sequelize.literal(
                    'CONCAT(`EP_Client`.`id`,"_",`children`.`id`,"_module_", `children->children`.`id`)'
                  ),
                  "value",
                ],
                ["name", "title"],
              ],
              include: [
                {
                  required: true,
                  association: EP_Module.tasks,
                  attributes: [],
                  include: [
                    {
                      association: EP_Task.team,
                      where: { user_id },
                      attributes: [],
                    },
                  ],
                },
              ],
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
    res.json(formatResponse(true, data));
  }
};

module.exports = {
  handleGetUserFilterTimelogTree,
  handleGetUserTimelogTree,
  handleGetUserTimelogResources,
  handleGetStatusFilterSelect,
  handleCreateTimelogData,
  handleGetTimelogData,
  handleUpdateTimelogData,
  handleDeleteTimelog,
};
