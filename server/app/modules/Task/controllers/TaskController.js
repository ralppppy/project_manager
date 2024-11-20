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

const { createToken } = require("../../AuthModule/services/AuthServices");

const fs = require("fs");
const { verifyToken } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware.js"
));

const {
  EP_Task,
  EP_Timelog,
  EP_TaskComment,
  EP_TasksTeam,
  EP_GanttChart,
  EP_File,
} = require(path.resolve("database", "models"));

const uploadFilePathImages = path.resolve("public", "images");
const uploadFilePathFile = path.resolve("public", "files");

const handleCreateTask = async (req, res) => {
  let data = req.body;

  let [task, error] = await create(EP_Task, data, null, {
    include: [
      {
        association: EP_Task.team,
      },
    ],
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, task));
  }
};

const handleCreateTaskComment = async (req, res) => {
  let data = req.body;

  let [taskComment, error] = await create(EP_TaskComment, data, ["id"]);
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    let [newComment, error] = await getOne(
      EP_TaskComment,
      { id: taskComment.id },

      ["id", "comment", "reply_to_id", "createdAt", "updatedAt"],

      {
        include: [
          {
            association: EP_TaskComment.commenter,
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      }
    );
    if (error) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, newComment));
    }
  }
};
const handleGetTaskComment = async (req, res) => {
  let data = req.params;

  let { isInternal } = req.query;

  isInternal = isInternal === "true";

  let [taskComment, error] = await get(
    EP_TaskComment,
    { ...data, reply_to_id: null, is_internal: isInternal },
    null,
    [
      "id",
      "comment",
      [sequelize.literal("COUNT(attachments.id)"), "attachmentsCount"],

      "createdAt",
      "updatedAt",
    ],
    null,
    {
      group: ["id"],

      include: [
        {
          association: EP_TaskComment.attachments,
          attributes: [],
        },
        {
          association: EP_TaskComment.commenter,
          attributes: ["id", "first_name", "last_name"],
        },
        {
          association: EP_TaskComment.replies,
          separate: true,
          group: ["id"],
          attributes: [
            "id",
            "comment",
            [
              sequelize.literal("COUNT(reply_attachments.id)"),
              "attachmentsCount",
            ],
            "reply_to_id",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              association: EP_TaskComment.commenter,
              attributes: ["id", "first_name", "last_name"],
            },
            {
              association: EP_TaskComment.reply_attachments,
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
    res.json(formatResponse(true, taskComment));
  }
};

const handleUpdateTask = async (req, res) => {
  let data = req.body;
  let { task_id } = req.params;

  let [task, error] = await update(EP_Task, data, { id: task_id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    let newTeam = data.team.map((c) => {
      let { id, ...rest } = c;
      return { ...rest, task_id };
    });
    let [team, error] = await bulkCreate(EP_TasksTeam, newTeam, null);

    let teamIds = team.map((c) => c.id);

    let [newTeamData, newTeamError] = await get(
      EP_TasksTeam,
      { id: teamIds },
      null,
      null,
      null,
      {
        include: [
          {
            required: true,

            association: EP_TasksTeam.user,
            attributes: ["id", "first_name", "last_name"],
          },
          {
            association: EP_TasksTeam.project_role,
            attributes: ["id", "name"],
          },
        ],
      }
    );

    if (error) {
      res.json(formatResponse(false, null));
    } else {
      res.json(formatResponse(true, newTeamData));
    }
  }
};

const handleIndividualTaskInputUpdate = async (req, res) => {
  let data = req.body;
  let { task_id } = req.params;

  let [task, error] = await update(EP_Task, data, { id: task_id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, task));
  }
};

const formatGetTaskWhere = (column, value) => {
  return isNaN(value)
    ? value.toLowerCase().includes("all")
      ? {}
      : { [column]: null }
    : { [column]: value };
};

const handleGetTask = async (req, res) => {
  let { organization_id, client_id, project_id, module_id } = req.params;
  let {
    paginate,
    filters,
    taskTitleSearch,
    isFeedback,
    isDashboard,
    currentUserId,
  } = req.query;

  let user = req.user;
  //if isNaN(module_id) / module_id === All then do not query for specific module
  let moduleIdWhere = formatGetTaskWhere("module_id", module_id);
  let projectIdWhere = formatGetTaskWhere("project_id", project_id);
  let clientIdWhere = formatGetTaskWhere("client_id", client_id);

  //convert string to boolean
  isFeedback = isFeedback === "true";
  isDashboard = isDashboard === "true";
  const isEmployee = user.is_employee;

  //If the page is feedback then only get task that is feedback
  // moduleIdWhere = isFeedback ? { module_id: 0 } : moduleIdWhere;
  let isFeedbackWhere = {};

  if (isEmployee) {
    isFeedbackWhere = isFeedback
      ? { is_feedback: true }
      : { is_feedback: false };
  } else {
    clientIdWhere = { ...clientIdWhere, client_id: user.client.client_id };
  }

  const includeArray = [
    {
      association: EP_Task.creator,
      attributes: ["id", "first_name", "last_name"],
    },
    {
      association: EP_Task.client,
      attributes: ["id", "name"],
    },
    {
      association: EP_Task.project,
      attributes: ["id", "name"],
    },
    {
      association: EP_Task.parent_task,
      attributes: ["id", "task_title"],
    },
    {
      association: EP_Task.task_type,
      attributes: ["id", "name", "color"],
    },
    {
      association: EP_Task.task_priority,
      attributes: ["id", "name", "color"],
    },
    {
      association: EP_Task.task_status,
      attributes: ["id", "name", "color"],
    },
    {
      association: EP_Task.team,
      attributes: ["id"],

      include: [
        {
          // required: true,
          association: EP_TasksTeam.user,
          attributes: ["id", "first_name", "last_name"],
        },
        {
          association: EP_TasksTeam.project_role,
          attributes: ["id", "name"],
        },
      ],
    },
  ];

  if (isDashboard) {
    includeArray.find((item) => item.association === EP_Task.team).where = {
      // task_id: { [Op.ne]: null }, // Adjust this condition based on your TaskTeams structure
      user_id: currentUserId, // Add your condition for the dashboard
    };
  }

  let [tasks, error] = await get(
    EP_Task,
    {
      organization_id,
      ...clientIdWhere,
      ...projectIdWhere,
      ...moduleIdWhere,
      ...isFeedbackWhere,
      task_type_id: filters.task_type_filter || [],
      task_status_id: filters.task_status_filter || [],
      task_priority_id: filters.task_priority_filter || [],
      is_approved: filters.task_approval_filter || [],
      [Op.or]: {
        task_title: { [Op.like]: `%${taskTitleSearch}%` },
        id: { [Op.like]: `%${taskTitleSearch}%` },
      },
    },
    null,
    [
      "id",
      "task_title",
      "instruction",
      "is_approved",
      "time_estimate",
      "is_time_estimate_approved",
      "deadline",
      "connected_to_id",
      "module_id",
      "is_feedback",
      "createdAt",
    ],
    paginate,
    {
      order: [["createdAt", "DESC"]],
      include: includeArray,
    }
    // {
    //   include: [
    //     {
    //       association: EP_Task.team_empty,
    //       attributes: [],
    //       where: {
    //         user_id: currentUserId,
    //       },
    //       required: true,
    //     },
    //   ],
    // }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, tasks));
  }
};

const handleGetTaskDropdown = async (req, res) => {
  let { organization_id, client_id, project_id, module_id } = req.params;

  let { search } = req.query;

  const moduleIdWhere = !isNaN(module_id) ? { module_id } : {};

  if (!search) {
    return res.json(formatResponse(true, []));
  }

  search = search ? search : "";

  let [tasks, error] = await get(
    EP_Task,
    {
      organization_id,
      client_id,
      project_id,
      ...moduleIdWhere,
      [Op.or]: {
        id: search,
        task_title: { [Op.like]: `%${search}%` },
      },
      connected_to_id: { [Op.is]: null },
    },
    null,
    ["id", "task_title"],
    null
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, tasks));
  }
};

const handleDeleteMember = async (req, res) => {
  let { organization_id, team_task_id } = req.params;

  let [response, error] = await destroy(EP_TasksTeam, {
    organization_id,
    id: team_task_id,
  });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

const handleSingleGetTask = async (req, res) => {
  let { organization_id, client_id, project_id, module_id, task_id } =
    req.params;

  let [response, error] = await getOne(
    EP_Task,
    {
      organization_id,
      client_id,
      project_id,
      module_id,
      id: task_id,
    },
    [
      "id",
      "task_title",
      "instruction",
      "is_approved",
      "time_estimate",
      "hours_worked",
      "deadline",
      "connected_to_id",
      "module_id",
      "createdAt",
    ],
    {
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: EP_Task.creator,
          attributes: ["id", "first_name", "last_name"],
        },
        {
          association: EP_Task.client,
          attributes: ["id", "name"],
        },
        {
          association: EP_Task.project,
          attributes: ["id", "name"],
        },
        // {
        //   association: EP_Task.child_tasks,
        //   attributes: ["id", "task_title"],
        // },
        {
          association: EP_Task.parent_task,
          attributes: ["id", "task_title"],
        },
        {
          association: EP_Task.task_type,
          attributes: ["id", "name", "color"],
        },
        {
          association: EP_Task.task_priority,
          attributes: ["id", "name", "color"],
        },
        {
          association: EP_Task.task_status,
          attributes: ["id", "name", "color"],
        },
        {
          association: EP_Task.team,
          attributes: ["id"],
          separate: true,
          include: [
            {
              required: true,

              association: EP_TasksTeam.user,
              attributes: ["id", "first_name", "last_name"],
            },
            {
              association: EP_TasksTeam.project_role,
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
    res.json(formatResponse(true, response));
  }
};

const handleGetHoursWorked = async (req, res) => {
  let { organization_id, task_id } = req.params;

  let [response, error] = await get(
    EP_Timelog,
    {
      organization_id,
      task_id,
    },
    [["id", "DESC"]],
    ["id", "start_date", "end_date", "hours_worked"],
    null,
    {
      include: [
        {
          association: EP_Timelog.user,
          attributes: ["id", "first_name", "last_name"],
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

const deleteAttachmentDataFile = async ({ task_id, organization_id }) => {
  let [files, error] = await get(
    EP_File,
    { task_id, organization_id },
    null,
    ["file_name", "file_type"],
    null,
    {
      raw: true,
    }
  );

  //Delete file in the files storage
  for (let file of files) {
    let fullFilePath = path.resolve(
      file.file_type === "images" ? uploadFilePathImages : uploadFilePathFile,
      file.file_name
    );

    let fileExist = fs.existsSync(fullFilePath);

    if (fileExist) {
      fs.unlinkSync(fullFilePath);
    }
  }

  //Delete data in database table
  return await destroy(EP_File, {
    task_id,
    organization_id,
  });
};

const handleDeleteCommentAndAttachment = async (req, res) => {
  let { organization_id, task_id } = req.params;
  const [_, token] = req.headers.authorization.split(" ");

  let [decoded, error] = verifyToken(token);

  if (!error) {
    const result = await Promise.all([
      destroy(EP_Task, {
        id: task_id,
        organization_id,
      }),
      destroy(EP_GanttChart, {
        task_id,
        organization_id,
      }),
      destroy(EP_TasksTeam, {
        task_id,
        organization_id,
      }),
      destroy(EP_TaskComment, {
        task_id,
        organization_id,
      }),
      deleteAttachmentDataFile({ task_id, organization_id }),
    ]);

    res.json(formatResponse(true, "Successfully deleted task!"));
  } else {
    res.sendStatus(401);
  }
};

const handleDeleteTask = async (req, res) => {
  let { organization_id, task_id } = req.params;

  let [
    [response, error],
    [commentCount, commentError],
    [fileCount, fileError],
  ] = await Promise.all([
    get(
      EP_Timelog,
      {
        organization_id,
        task_id,
      },
      [["id", "DESC"]],
      [
        "id",

        [
          sequelize.literal("DATE_FORMAT(start_date, '%d-%m-%Y')"),
          "date_plotted",
        ],
      ],
      null,
      {
        group: ["date_plotted"],
      }
    ),
    count(EP_TaskComment, {
      organization_id,
      task_id,
    }),
    count(EP_File, {
      organization_id,
      task_id,
    }),
  ]);

  if (response.length > 0) {
    return res.status(403).send(
      formatResponse(
        false,
        null,
        {
          datePlotted: response,
          message: "Task cannot be deleted as it is already in the timelog.",
        },
        null,
        "not_allowed"
      )
    );
  } else {
    if (commentCount > 0 || fileCount > 0) {
      let deleteToken = await createToken(
        { organization_id, task_id },
        { expiresIn: "1m" }
      );
      return res.status(409).send(
        formatResponse(
          false,
          null,
          {
            deleteToken,
            extraData: { organization_id, task_id },
            message:
              "Deleting this task will delete all comments and attachements within it.",
          },
          null,
          "warining"
        )
      );
    }

    const result = await Promise.all([
      destroy(EP_Task, {
        id: task_id,
        organization_id,
      }),
      destroy(EP_GanttChart, {
        task_id,
        organization_id,
      }),
      destroy(EP_TasksTeam, {
        task_id,
        organization_id,
      }),
    ]);

    res.json(formatResponse(true, "Successfully deleted task!"));
  }
};

const handleDeleteComment = async (req, res) => {
  let { organization_id, comment_id } = req.params;
  let { commenter_id } = req.query;
  let currentUser = req.user;
  //Server validation
  //Make sure that this api is safe if the api was accesss not in the page itself
  if (parseInt(commenter_id) !== parseInt(currentUser.id)) {
    return res.sendStatus(403);
  } else {
    let [[attachementsCount, error], [replyToCount, replyToError]] =
      await Promise.all([
        count(EP_File, {
          organization_id,
          comment_id,
        }),
        count(EP_TaskComment, {
          organization_id,
          // id: comment_id,
          reply_to_id: comment_id,
        }),
      ]);

    if (attachementsCount > 0 || replyToCount > 0) {
      return res.sendStatus(403);
    }
  }

  let [response, error] = await destroy(EP_TaskComment, {
    organization_id,
    id: comment_id,
  });
  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, response));
  }
};

module.exports = {
  handleCreateTask,
  handleGetTask,
  handleGetTaskDropdown,
  handleUpdateTask,
  handleDeleteMember,
  handleCreateTaskComment,
  handleGetTaskComment,
  handleIndividualTaskInputUpdate,
  handleSingleGetTask,
  handleGetHoursWorked,
  handleDeleteTask,
  handleDeleteComment,
  handleDeleteCommentAndAttachment,
};
