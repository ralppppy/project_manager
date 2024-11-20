import { lazy } from "react";

const SideBarMenu = lazy(() => import("./SideBarMenu"));
const LayoutHeader = lazy(() => import("./LayoutHeader"));
const LeftColumnText = lazy(() => import("./LeftColumnText"));
const Footer = lazy(() => import("./Footer"));

export { SideBarMenu, LayoutHeader, LeftColumnText, Footer };
