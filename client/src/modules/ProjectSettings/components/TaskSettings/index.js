import { lazy } from "react";

const TaskSettings = lazy(() => import("./TaskSettings"));
const TaskCompletion = lazy(() => import("./TaskCompletion"));

export { TaskSettings, TaskCompletion };
