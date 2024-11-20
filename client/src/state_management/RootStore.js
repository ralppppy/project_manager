import { configureStore } from "@reduxjs/toolkit";

import { ProjectModel } from "@modules/Project/models";
import { ProfileModel } from "@modules/Profile/models";
import { LoginModel } from "@modules/Guest/models";
import Global from "./Global";
import { ClientModel } from "@modules/Client/models";
import { ExactPlaceTableModel } from "@modules/Common/ExactPlaceTable/models";
import { ModuleListModel } from "@modules/ModuleList/models";
import { HolidayModel } from "@modules/Holiday/models";
import { TimelogModel } from "@modules/Timelog/models";
import { CommonModel } from "../modules/Common/models";
import { TasksListModel } from "../modules/TasksList/models";
import { GanttChartModel } from "../modules/GanttChart/models";
import { UserManagementModel } from "../modules/UserManagement/models";

export const store = configureStore({
  reducer: {
    global: Global,
    login: LoginModel,
    project: ProjectModel,
    profile: ProfileModel,
    module: ModuleListModel,
    timelog: TimelogModel,
    client: ClientModel,
    holiday: HolidayModel,
    table: ExactPlaceTableModel,
    taskList: TasksListModel,
    common: CommonModel,
    ganttChart: GanttChartModel,
    userManagement: UserManagementModel,
  },
});
