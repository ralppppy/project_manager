import { lazy } from "react";

const UserManagementTable = lazy(() => import("./UserManagementTable"));
const TableHeader = lazy(() => import("./TableHeader"));
const UserModalForm = lazy(() => import("./UserModalForm"));
const UserForm = lazy(() => import("./UserForm"));
const UserTypeForm = lazy(() => import("./UserTypeForm"));
const DepartmentForm = lazy(() => import("./DepartmentForm"));

export {
  UserManagementTable,
  TableHeader,
  UserModalForm,
  UserForm,
  UserTypeForm,
  DepartmentForm,
};
