import React, { useEffect, useMemo } from "react";
import { Button, ConfigProvider, Result, theme } from "antd";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  useLocation,
} from "react-router-dom";

// Routes
import { Routes } from "./common";

// Views
import MainLayout from "./modules/Layout/views/MainLayout";
import { Login, SetPassword } from "./modules/Guest/views";
import { Dashboard } from "./modules/Dashboard/views";
import { FeedbackList } from "./modules/FeedbackList/view";
import { Clients } from "./modules/Client/views";
import Project from "./modules/Project/views/Project";
import { Timelogs } from "./modules/Timelog/views";
import { GanttChart } from "./modules/GanttChart/views";
import { ModuleList } from "./modules/ModuleList/views";
import { Profile } from "./modules/Profile/views";
import { Password } from "./modules/Password/views";
import { TasksList } from "./modules/TasksList/views";
import { ProjectSettings } from "./modules/ProjectSettings/views";
import { UserManagement } from "./modules/UserManagement/views";

// Controllers
import { LoginController } from "@modules/Guest/controller";

// Models
import { initialState as ProjectIntialState } from "./modules/Project/models/ProjectModel";
import { initialState as ClientInitialState } from "./modules/Client/models/ClientModel";
import { initialState as HolidayInitialState } from "./modules/Holiday/models/HolidayModel";
import { initialState as ModuleListInitialState } from "./modules/ModuleList/models/ModuleListModel";
import { initialState as TasksListInitialState } from "./modules/TasksList/models/TasksListModel";

// CSS
import "./App.css";
import GuestLayout from "./modules/Layout/views/GuestLayout";
import ForgotPassword from "./modules/Guest/views/ForgotPassword";
import { Holiday } from "./modules/Holiday/views";

dayjs.extend(utc);
dayjs.extend(timezone);

const EMPLOYEE = "employee";
const CLIENT = "client";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const primaryColor = useSelector((state) => state.global.primaryColor);
  const background = useSelector((state) => state.global.background);
  const dispatch = useDispatch();

  const isEmployee = useSelector((state) => state.login.user.is_employee);
  const menu_access = useSelector((state) => state.login.user.menu_access);
  const isEmployeeText = isEmployee ? "employee" : "client";
  let { verifyToken } = LoginController({ dispatch });
  const { token } = theme.useToken();

  document.documentElement.style.setProperty(
    "--fc-border-color",
    background.borderColor
  );
  document.documentElement.style.setProperty("--primary-color", primaryColor);
  document.documentElement.style.setProperty(
    "--background-color",
    background.color
  );
  document.documentElement.style.setProperty(
    "--text-color",
    background.textColor
  );

  console.log(isEmployeeText, "isEmployeeText");

  const router = useMemo(() => {
    let routes = [
      {
        path: Routes.dashboard,
        element: (
          <>
            <ScrollToTop /> <MainLayout />
          </>
        ),
        shouldRevalidate: () => false,
        allowed: [EMPLOYEE, CLIENT],
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return redirect(Routes.login);
          } else {
            return { success: true };
          }
        },
        children: [
          {
            path: Routes.dashboard,
            element: <Dashboard />,
            allowed: [EMPLOYEE, CLIENT],
            keyCode: "DSHBRD",
            loader: ({ request }) => {
              if (typeof isEmployee === "boolean" && !isEmployee) {
                return redirect(Routes.feedbackList);
              }

              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : TasksListInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: Routes.ganttChart,
            element: <GanttChart />,
            allowed: [EMPLOYEE],
            keyCode: "GNTCHT",
          },

          {
            path: `${Routes.feedbackList}`,
            allowed: [EMPLOYEE, CLIENT],
            keyCode: "FDBLST",
            element: <FeedbackList />,
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : TasksListInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },

          {
            path: Routes.moduleList,
            element: <ModuleList />,
            allowed: [EMPLOYEE],
            keyCode: "MDLLST",
            loader: ({ request }) => {
              return { redirect: true };
            },
          },
          {
            path: `${Routes.moduleList}/:client_id/:project_id`,
            element: <ModuleList />,
            allowed: [EMPLOYEE],
            keyCode: "MDLLST",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : ModuleListInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: `${Routes.moduleList}/:client_id/:project_id/:module_id`,
            allowed: [EMPLOYEE],
            keyCode: "MDLLST",
            element: <TasksList />,
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : TasksListInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },

          {
            path: Routes.holidays,
            allowed: [EMPLOYEE],
            element: <Holiday />,
            keyCode: "HLIDYS",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : HolidayInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: Routes.clients,
            allowed: [EMPLOYEE],
            element: <Clients />,
            keyCode: "CLNTS",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : ClientInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: Routes.projects,
            element: <Project />,
            allowed: [EMPLOYEE],
            keyCode: "PRJCTS",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");

              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : ProjectIntialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: Routes.timeLogs,
            element: <Timelogs />,
            allowed: [EMPLOYEE],
            keyCode: "TMLGS",
          },
          {
            path: Routes.projectSettings,
            element: <ProjectSettings />,
            allowed: [EMPLOYEE],
            keyCode: "PRJSTS",
          },
          {
            path: Routes.userManagement,
            allowed: [EMPLOYEE],
            element: <UserManagement />,
            keyCode: "USRMGT",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : ClientInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: Routes.profile,
            element: <Profile />,
            allowed: [EMPLOYEE, CLIENT],
            keyCode: "PRLFLE",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : TasksListInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
          {
            path: Routes.password,
            element: <Password />,
            keyCode: "PSSWRD",
            allowed: [EMPLOYEE, CLIENT],
          },
          {
            path: "*",
            keyCode: "GUEST",
            element: (
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
              />
            ),
            allowed: [EMPLOYEE, CLIENT],
          },
        ],
      },

      {
        path: Routes.login,
        element: <GuestLayout />,
        allowed: [EMPLOYEE, CLIENT],
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return true;
          } else {
            return redirect(Routes.dashboard);
          }
        },
        children: [
          {
            path: Routes.login,
            allowed: [EMPLOYEE, CLIENT],
            element: <Login />,
            keyCode: "GUEST",
          },
        ],
      },
      {
        path: Routes.setPassword,
        allowed: [EMPLOYEE, CLIENT],
        element: <GuestLayout />,
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return true;
          } else {
            return redirect(Routes.dashboard);
          }
        },
        children: [
          {
            path: Routes.setPassword,
            allowed: [EMPLOYEE, CLIENT],
            element: <SetPassword />,
            keyCode: "GUEST",
          },
        ],
      },
      {
        path: Routes.accountRecovery,
        element: <GuestLayout />,
        allowed: [EMPLOYEE, CLIENT],
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return true;
          } else {
            return redirect(Routes.dashboard);
          }
        },
        children: [
          {
            path: Routes.accountRecovery,
            element: <ForgotPassword />,
            allowed: [EMPLOYEE, CLIENT],
            keyCode: "GUEST",
          },
        ],
      },
    ];

    routes = routes.map((route) => {
      let newChildren = route?.children?.map((c) => {
        if (!c.allowed.includes(isEmployeeText)) {
          return {
            ...c,
            element: (
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
              />
            ),
          };
        }

        return c;
      });

      return { ...route, children: newChildren };
    });

    //Give only menu which the user is assigned to
    routes = routes.map((route) => {
      let newChildren = route?.children?.filter((c) => {
        // console.log(menu_access, "menu_access");
        let isAllowed = menu_access?.find((menu) => {
          return menu.menu_key_code === c.keyCode;
        });

        let isAllowed2 = c.allowed.includes(isEmployeeText);

        //We always allow GUEST keyCode because all of user type should access this routes, sample of this routes are, login resetpasswor and error 404 routes
        return isAllowed || isAllowed2 || c.keyCode === "GUEST";
      });

      return { ...route, children: newChildren };
    });

    return createBrowserRouter(routes);
  }, [isEmployee, isEmployeeText]);

  let isLightMode =
    background.color === "#fff" || background.color === "#dddddd";

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          components: {
            Switch: {
              colorPrimary: token.blue6,
              colorPrimaryHover: token.blue5,
              colorPrimaryBorder: token.blue4,

              colorTextQuaternary: token.green6,
              colorTextTertiary: token.green5,
              colorTextSecondary: token.green4,
            },
          },
          algorithm: isLightMode
            ? [theme.compactAlgorithm]
            : [theme.compactAlgorithm, theme.darkAlgorithm],

          token: {
            colorPrimary: primaryColor,
            // colorPrimary: "#00b96b",
            colorBgBase: background.color,
            // colorBgBase: "#15202b",
            fontFamily: "Poppins",
            colorLink: isLightMode ? "#1677ff" : "#4A90E2",

            colorLinkHover: isLightMode ? "#69b1ff" : "#357EC6",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </div>
  );
}

export default App;
