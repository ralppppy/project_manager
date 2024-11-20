import { lazy } from "react";

// import CalendarView from "./CalendarView";

const CalendarView = lazy(() => import("./CalendarView"));
export { CalendarView };
