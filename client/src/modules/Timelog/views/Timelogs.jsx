import React, { Suspense } from "react";
import { TimelogBody, TimelogHeader } from "../components";

function Timelogs() {
  return (
    <>
      <Suspense fallback={<></>}>
        <TimelogHeader />
        <TimelogBody />
      </Suspense>
    </>
  );
}

export default Timelogs;
