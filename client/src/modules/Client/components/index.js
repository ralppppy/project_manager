import { lazy } from "react";

const TableHeader = lazy(() => import("./TableHeader"));
const ClientModalForm = lazy(() => import("./ClientModalForm"));
const ClientTable = lazy(() => import("./ClientTable"));
const ProjectDetails = lazy(() => import("./ProjectDetails"));
const AddUserClientModal = lazy(() => import("./AddUserClientModal"));
const UserClientForm = lazy(() => import("./UserClientForm"));
const ClientUserManagementTable = lazy(() =>
  import("./ClientUserManagementTable")
);

export {
  TableHeader,
  ClientModalForm,
  ClientTable,
  ProjectDetails,
  AddUserClientModal,
  ClientUserManagementTable,
  UserClientForm,
};
