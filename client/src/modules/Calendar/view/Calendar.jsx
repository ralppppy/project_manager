import React, { Suspense } from "react";
import { CalendarView } from "../components";

const Calendar = () => {
  return (
    <div>
      <Suspense fallback={<></>}>
        <CalendarView />
      </Suspense>
    </div>
  );
};

export default Calendar;
