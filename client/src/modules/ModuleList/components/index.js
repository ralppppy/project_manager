import { lazy } from "react";

const ModuleCardsList = lazy(() => import("./ModuleCardsList"));
const ProjectList = lazy(() => import("./ProjectList"));
const ModuleModalForm = lazy(() => import("./ModuleModalForm"));
const ModuleForm = lazy(() => import("./ModuleForm"));
const ModuleListClientsDropdown = lazy(() =>
  import("./ModuleListClientsDropdown")
);
const ModuleListProjectsDropdown = lazy(() =>
  import("./ModuleListProjectsDropdown")
);
const ModuleListAddTeam = lazy(() => import("./ModuleListAddTeam"));
const FilterStatusContainer = lazy(() => import("./FilterStatusContainer"));
const ModuleSearchInput = lazy(() => import("./ModuleSearchInput"));

export {
  ModuleCardsList,
  ProjectList,
  ModuleModalForm,
  ModuleForm,
  ModuleListClientsDropdown,
  ModuleListProjectsDropdown,
  ModuleListAddTeam,
  FilterStatusContainer,
  ModuleSearchInput,
};
