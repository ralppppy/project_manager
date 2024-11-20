import { lazy } from "react";

const ProjectTable = lazy(() => import("./ProjectTable"));
const HeaderTitle = lazy(() => import("./HeaderTitle"));
const SetProjectPriority = lazy(() => import("./SetProjectPriority"));
const AddProjectButton = lazy(() => import("./AddProjectButton"));
const ProjectModalForm = lazy(() => import("./ProjectModalForm"));
const ClientsDropdown = lazy(() => import("./ClientsDropdown"));
const AddTeam = lazy(() => import("./AddTeam"));
const AddVersions = lazy(() => import("./AddVersions"));
const SwitchesFilter = lazy(() => import("./SwitchesFilter"));
const ProjectDetails = lazy(() => import("./ProjectDetails"));
const ProjectForm = lazy(() => import("./ProjectForm"));

export {
  ProjectTable,
  HeaderTitle,
  SetProjectPriority,
  AddProjectButton,
  ProjectModalForm,
  ClientsDropdown,
  AddTeam,
  AddVersions,
  SwitchesFilter,
  ProjectDetails,
  ProjectForm,
};
