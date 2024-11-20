import { lazy } from "react";
import { EditableCell, EditableRow } from "./EditableCell";

const FilterStatus = lazy(() => import("./FilterStatus"));
const FilterStatusModuleList = lazy(() => import("./FilterStatusModuleList"));
const PointsModal = lazy(() => import("./PointsModal"));
const CommentList = lazy(() => import("./CommentList"));
const Developers = lazy(() => import("./Developers"));
const ProjectInfoCard = lazy(() => import("./ProjectInfoCard"));
const BundledEditor = lazy(() => import("./BundledEditor"));
const FilterStatusGanttChart = lazy(() => import("./FilterStatusGanttChart"));
const FilterStatusFeedbackList = lazy(() =>
  import("./FilterStatusFeedbackList")
);

export {
  FilterStatus,
  FilterStatusModuleList,
  PointsModal,
  CommentList,
  Developers,
  ProjectInfoCard,
  EditableCell,
  EditableRow,
  BundledEditor,
  FilterStatusGanttChart,
  FilterStatusFeedbackList,
};
