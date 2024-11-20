import { lazy } from "react";

const TableHeader = lazy(() => import("./TableHeader"));
const HolidayTable = lazy(() => import("./HolidayTable"));
const HolidayModalForm = lazy(() => import("./HolidayModalForm"));
const HolidayForm = lazy(() => import("./HolidayForm"));
const HolidayTypeDropdown = lazy(() => import("./HolidayTypeDropdown"));

export {
  TableHeader,
  HolidayTable,
  HolidayModalForm,
  HolidayForm,
  HolidayTypeDropdown,
};
