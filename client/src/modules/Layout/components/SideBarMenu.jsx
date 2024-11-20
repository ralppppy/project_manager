import React, { useState } from "react";
import { Affix, Layout, Menu } from "antd";
import style from "./style.module.css";
import { Link, useResolvedPath } from "react-router-dom";
import { Routes } from "../../../common";
import LayoutController from "../controller/LayoutController";
import "./styles.css";
import {
  CommentOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const EMPLOYEE = "employee";
const CLIENT = "client";

/**
 * Configuration for navigation items.
 * Each item represents a section in the application with associated routes and permissions.
 * The keys play a crucial role in uniquely identifying and persistently storing each item in the database.
 * These keys should not be altered by developers to maintain consistency in the database.
 */
export const items = [
  {
    label: "Workplace",
    icon: React.createElement(DashboardOutlined),
    key: "workplace",
    keyCode: "WKPLC1",
    type: "group",
    labelText: "Workplace",
    allowed: [EMPLOYEE, CLIENT],
    children: [
      {
        label: <Link to={Routes.dashboard}>Dashboard</Link>,
        labelText: "Dashboard",
        icon: React.createElement(DashboardOutlined),
        key: "dashboard",
        keyCode: "DSHBRD",
        allowed: [EMPLOYEE],
      },
      {
        label: <Link to={Routes.ganttChart}>Gantt Chart</Link>,
        labelText: "Gantt Chart",
        icon: React.createElement(CalendarOutlined),
        key: "ganttChart",
        keyCode: "GNTCHT",
        allowed: [EMPLOYEE],
      },
      {
        label: (
          <Link to={`${Routes.feedbackList.replaceAll("/:status", "")}`}>
            Feedback List
          </Link>
        ),
        labelText: "Feedback List",
        icon: React.createElement(CommentOutlined),
        key: "feedbackList",
        keyCode: "FDBLST",
        allowed: [EMPLOYEE, CLIENT],
      },
      {
        label: <Link to={`${Routes.moduleList}`}>Module List</Link>,
        icon: React.createElement(CommentOutlined),
        key: "moduleList",
        keyCode: "MDLLST",
        labelText: "Module List",
        allowed: [EMPLOYEE],
      },
      {
        label: <Link to={Routes.holidays}>Holidays</Link>,
        icon: React.createElement(CommentOutlined),
        key: "holidays",
        keyCode: "HLIDYS",
        labelText: "Holidays",
        allowed: [EMPLOYEE],
      },
      {
        label: <Link to={Routes.clients}>Clients</Link>,
        icon: React.createElement(TeamOutlined),
        labelText: "Clients",
        key: "clients",
        keyCode: "CLNTS",
        allowed: [EMPLOYEE],
      },
      {
        label: <Link to={Routes.projects}>Projects</Link>,
        icon: React.createElement(FolderOpenOutlined),
        labelText: "Projects",
        key: "projects",
        keyCode: "PRJCTS",
        allowed: [EMPLOYEE],
      },
      {
        label: <Link to={Routes.timeLogs}>Time Logs</Link>,
        labelText: "Time Logs",
        icon: React.createElement(FieldTimeOutlined),
        key: "timeLogs",
        keyCode: "TMLGS",
        allowed: [EMPLOYEE],
      },
    ],
  },
  {
    label: "Manage",
    icon: React.createElement(DashboardOutlined),
    key: "manage",
    keyCode: "MNGE1",
    labelText: "Manage",
    type: "group",
    allowed: [EMPLOYEE],

    children: [
      {
        label: <Link to={Routes.projectSettings}>Project Settings</Link>,
        icon: React.createElement(LockOutlined),
        key: "projectSettings",
        keyCode: "PRJSTS",
        labelText: "Project Settings",
        allowed: [EMPLOYEE],
      },
      {
        label: <Link to={Routes.userManagement}>User Management</Link>,
        icon: React.createElement(UserOutlined),
        labelText: "User Management",
        key: "userManagement",
        keyCode: "USRMGT",
        allowed: [EMPLOYEE],
      },
    ],
  },
  {
    label: "Account",
    icon: React.createElement(DashboardOutlined),
    key: "account",
    keyCode: "ACNT1",
    labelText: "Account",
    type: "group",
    allowed: [EMPLOYEE, CLIENT],
    children: [
      {
        label: <Link to={Routes.profile}>Profile</Link>,
        icon: React.createElement(UserOutlined),
        labelText: "Profile",
        key: "profile",
        keyCode: "PRLFLE",
        allowed: [EMPLOYEE, CLIENT],
      },
      {
        label: <Link to={Routes.password}>Password</Link>,
        icon: React.createElement(LockOutlined),
        labelText: "Password",
        key: "password",
        keyCode: "PSSWRD",
        allowed: [EMPLOYEE, CLIENT],
      },
    ],
  },
];

const SideBarMenu = ({ collapsed, setCollapsed, router }) => {
  const { getKeyByValue } = LayoutController();

  const menu_access = useSelector((state) => state.login.user.menu_access);

  const isEmployee = useSelector((state) => state.login.user.is_employee);
  const isEmployeeText = isEmployee ? "employee" : "client";

  let menuItems = items
    .filter((item) => {
      if (item.allowed.includes(isEmployeeText)) {
        return true;
      }

      return false;
    })
    .map((item) => {
      let newChildren = item.children.filter((c) => {
        if (menu_access) {
          let isMenuAllowed = menu_access.find(
            (menu) => menu.menu_key_code === c.keyCode
          );

          if (c.allowed.includes(isEmployeeText) && !!isMenuAllowed) {
            return true;
          }

          return false;
        } else {
          if (c.allowed.includes(isEmployeeText)) {
            return true;
          }

          return false;
        }
      });

      return { ...item, children: newChildren };
    });

  return (
    <Sider
      theme="light"
      style={{ minHeight: "100vh" }}
      breakpoint="lg"
      // collapsedWidth="0"
      collapsible
      collapsed={collapsed}
      onBreakpoint={(broken) => {
        // console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        setCollapsed(collapsed);

        // console.log(collapsed, type);
      }}
      trigger={null}
    >
      <Affix className="w-100" offsetTop={0.1}>
        <div>
          <div className={style.logo} />
          <Menu
            selectedKeys={[
              getKeyByValue(Routes, `/${router.pathname.split("/")[1]}`),
            ]}
            theme="light"
            mode="inline"
            items={menuItems}
          />
        </div>
      </Affix>
    </Sider>
  );
};

export default React.memo(SideBarMenu);
