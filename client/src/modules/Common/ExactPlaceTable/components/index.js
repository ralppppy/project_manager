import { lazy } from "react";

const ExactPlaceTable = lazy(() => import("./ExactPlaceTable"));
const TableHeader = lazy(() => import("./TableHeader"));
const TableModalForm = lazy(() => import("./TableModalForm"));

export { ExactPlaceTable, TableHeader, TableModalForm };
