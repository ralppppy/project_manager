import { lazy } from "react";

const GanttEvents = lazy(() => import("./GanttEvents"));
const GanttHeader = lazy(() => import("./GanttHeader"));
const GanttBody = lazy(() => import("./GanttBody"));
const GanttCalendar = lazy(() => import("./GanttCalendar"));
const Filters = lazy(() => import("./Filters"));
const FilterContainer = lazy(() => import("./FilterContainer"));
const SummaryTable = lazy(() => import("./SummaryTable"));
const SummaryTableModal = lazy(() => import("./SummaryTableModal"));
const ExtraDataTable = lazy(() => import("./ExtraDataTable"));

export {
  GanttHeader,
  GanttBody,
  GanttCalendar,
  GanttEvents,
  Filters,
  FilterContainer,
  SummaryTable,
  SummaryTableModal,
  ExtraDataTable,
};
