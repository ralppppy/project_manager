const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const requestLogger = require("./middleware/requestLogger");
const logger = require("morgan");
const users = require("./app/modules/UserModule/routes/users");
const clients = require("./app/modules/Client/routes/clients");
const projects = require("./app/modules/Project/routes/projects");
const project_role = require("./app/modules/ProjectRole/routes/project_role");
const module_list = require("./app/modules/ModuleList/routes/module_list");
const tasks_status = require("./app/modules/TasksStatus/routes/tasks_status");
const tasks_type = require("./app/modules/TasksType/routes/tasks_type");
const department = require("./app/modules/Department/routes/department");
const dashboard = require("./app/modules/Dashboard/routes/dashboard");
const tasks_priority = require("./app/modules/TasksPriority/routes/tasks_priority");
const tasks = require("./app/modules/Task/routes/tasks");
const user_type = require("./app/modules/UserType/routes/user_type");
const auth = require("./app/modules/AuthModule/routes/auth");
const timelog = require("./app/modules/Timelog/routes/timelog");
const file = require("./app/modules/FileModule/routes/file");
const gantt_chart = require("./app/modules/GanntChart/routes/gantt_chart");
const task_completion_setting = require("./app/modules/TaskCompletionSetting/routes/task_completion_setting");
const user_type_menu_access = require("./app/modules/UsertypeMenuAccess/routes/user_type_menu_access");
const holiday_type = require("./app/modules/HolidayType/routes/holiday_type");
const holiday = require("./app/modules/Holiday/routes/holiday");

const compression = require("compression");
const fileUpload = require("express-fileupload");

const app = express();

// compress all responses
app.use(compression());
// app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(fileUpload());
// app.use(requestLogger);
app.use("/public", express.static(path.join(__dirname, "public")));

/**ROUTES */
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/clients", clients);
app.use("/api/projects", projects);
app.use("/api/project_roles", project_role);
app.use("/api/module_list", module_list);
app.use("/api/tasks_status", tasks_status);
app.use("/api/tasks_type", tasks_type);
app.use("/api/departments", department);
app.use("/api/dashboard", dashboard);
app.use("/api/tasks_priority", tasks_priority);
app.use("/api/tasks", tasks);
app.use("/api/user_types", user_type);
app.use("/api/timelog", timelog);
app.use("/api/files", file);
app.use("/api/gantt_chart", gantt_chart);
app.use("/api/task_completion_setting", task_completion_setting);
app.use("/api/user_type_menu_access", user_type_menu_access);
app.use("/api/holiday_type", holiday_type);
app.use("/api/holiday", holiday);

/**ROUTES */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error as JSON
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
