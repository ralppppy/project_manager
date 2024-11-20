import { lazy } from "react";

import SingleFilterInput from "./SingleFilterInput";
import TaskSearchInput from "./TaskSearchInput";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

const ProjectList = lazy(() => import("./ProjectList"));
const TasksTable = lazy(() => import("./TasksTable"));
const TasksListModalForm = lazy(() => import("./TasksListModalForm"));
const TaskStatusDropdown = lazy(() => import("./TaskStatusDropdown"));
const TasksTypeDropdown = lazy(() => import("./TasksTypeDropdown"));
const TasksPriorityDropdown = lazy(() => import("./TasksPriorityDropdown"));
const TaskAssingnee = lazy(() => import("./TaskAssingnee"));
const ConnectedToDropdown = lazy(() => import("./ConnectedToDropdown"));
const TimeEstimate = lazy(() => import("./TimeEstimate"));
const HoursWorked = lazy(() => import("./HoursWorked"));
const DeadlineForm = lazy(() => import("./DeadlineForm"));
const TaskTitleForm = lazy(() => import("./TaskTitleForm"));
const FilterStatusContainer = lazy(() => import("./FilterStatusContainer"));
const AddTaskBreadCrumb = lazy(() => import("./AddTaskBreadCrumb"));
const TaskInstructionForm = lazy(() => import("./TaskInstructionForm"));
const TaskTableFilters = lazy(() => import("./TaskTableFilters"));
const DataCountChart = lazy(() => import("./DataCountChart"));
const TasksComments = lazy(() => import("./TasksComments"));
const ModalForm = lazy(() => import("./ModalForm"));
const AttachmentDrawer = lazy(() => import("./AttachmentDrawer"));
const AddTaskPopover = lazy(() => import("./AddTaskPopover"));
// const SingleFilterInput = lazy(() => import("./SingleFilterInput"));

export {
  ProjectList,
  TasksTable,
  TasksListModalForm,
  TaskStatusDropdown,
  TasksTypeDropdown,
  TasksPriorityDropdown,
  TaskAssingnee,
  ConnectedToDropdown,
  TimeEstimate,
  DeadlineForm,
  TaskTitleForm,
  FilterStatusContainer,
  AddTaskBreadCrumb,
  TaskInstructionForm,
  TaskTableFilters,
  SingleFilterInput,
  TaskSearchInput,
  DataCountChart,
  TasksComments,
  ModalForm,
  CommentList,
  CommentInput,
  AttachmentDrawer,
  HoursWorked,
  AddTaskPopover,
};
