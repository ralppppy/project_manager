import { lazy } from "react";

const UserTypeSettings = lazy(() => import("./UserTypeSettings"));
const UserTypesList = lazy(() => import("./UserTypesList"));
const MenuItemsList = lazy(() => import("./MenuItemsList"));

export { UserTypeSettings, UserTypesList, MenuItemsList };
