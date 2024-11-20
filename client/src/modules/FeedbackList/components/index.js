import { lazy } from "react";

const FeedbackListsSingle = lazy(() => import("./FeedbackListsSingle"));
const StatusList = lazy(() => import("./StatusList"));
const TableFeedback = lazy(() => import("./TableFeedback"));
const MoreInfo = lazy(() => import("./MoreInfo"));
const ProjectList = lazy(() => import("./ProjectList"));

export {
  FeedbackListsSingle,
  StatusList,
  TableFeedback,
  MoreInfo,
  ProjectList,
};
