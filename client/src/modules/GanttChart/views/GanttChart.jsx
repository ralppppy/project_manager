import React, { Suspense } from "react";
import { GanttBody, GanttHeader } from "../components";
import { Card } from "antd";

function Staff() {
  return (
    <Suspense fallback={<></>}>
      <GanttHeader />

      <GanttBody />
    </Suspense>
  );
}

export default Staff;
