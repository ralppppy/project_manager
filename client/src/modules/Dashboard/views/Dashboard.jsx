import React, { Suspense } from "react";
import { DashboardBody, DashboardHeader, HeaderCards } from "../components";

function Dashboard() {
  return (
    <>
      <Suspense fallback={<></>}>
        <DashboardHeader />
        <HeaderCards />
        <DashboardBody />
      </Suspense>
    </>
  );
}

export default Dashboard;
