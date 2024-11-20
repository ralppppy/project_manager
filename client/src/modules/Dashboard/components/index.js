import { lazy } from "react";

const HeaderCards = lazy(() => import("./HeaderCards"));
const DashboardBody = lazy(() => import("./DashboardBody"));
const DashboardTable = lazy(() => import("./DashboardTable"));
const PointFilter = lazy(() => import("./PointFilter"));
const DashboardHeader = lazy(() => import("./DashboardHeader"));
const UnassignedTaskTable = lazy(() => import("./UnassignedTaskTable"));
const UnassignedProjectTable = lazy(() => import("./UnassignedProjectTable"));
const AssignedTabs = lazy(() => import("./AssignedTabs"));
const AssignedTable = lazy(() => import("./AssignedTable"));
const AssignedTableRow = lazy(() => import("./AssignedTableRow"));
const TasksPopover = lazy(() => import("./TasksPopover"));
const TasksPopoverContent = lazy(() => import("./TasksPopoverContent"));
const TasksPopoverTitle = lazy(() => import("./TasksPopoverTitle"));
const BarChart = lazy(() => import("./BarChart"));

export {
  HeaderCards,
  DashboardTable,
  PointFilter,
  DashboardBody,
  DashboardHeader,
  UnassignedTaskTable,
  UnassignedProjectTable,
  AssignedTabs,
  AssignedTable,
  AssignedTableRow,
  BarChart,
  TasksPopover,
  TasksPopoverContent,
  TasksPopoverTitle,
};
