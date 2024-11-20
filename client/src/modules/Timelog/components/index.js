import { lazy } from "react";
const TimelogBody = lazy(() => import("./TimelogBody"));
const FilterOptions = lazy(() => import("./FilterOptions"));
const TimelogCalendar = lazy(() => import("./TimelogCalendar"));
const FeedbackTree = lazy(() => import("./FeedbackTree"));
const FeedbackFilterSelect = lazy(() => import("./FeedbackFilterSelect"));
const FeedbackStatusSelect = lazy(() => import("./FeedbackStatusSelect"));
const HolidayFilterSelect = lazy(() => import("./HolidayFilterSelect"));
const HolidayTree = lazy(() => import("./HolidayTree"));
const TimelogHeader = lazy(() => import("./TimelogHeader"));
const TimelogSearchInput = lazy(() => import("./TimelogSearchInput"));
const AddTaskPopover = lazy(() => import("./AddTaskPopover"));
const TaskContent = lazy(() => import("./TaskContent"));

export {
  TimelogBody,
  FilterOptions,
  TimelogCalendar,
  FeedbackTree,
  FeedbackFilterSelect,
  FeedbackStatusSelect,
  HolidayFilterSelect,
  HolidayTree,
  TimelogHeader,
  TimelogSearchInput,
  AddTaskPopover,
  TaskContent,
};
