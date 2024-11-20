import React, { Suspense } from "react";
import { SetPasswordForm } from "../components";
import { Grid } from "antd";
const { useBreakpoint } = Grid;

function SetPassword() {
  const screens = useBreakpoint();
  return (
    <div
      style={{ height: screens.lg ? "80%" : "100%" }}
      className="d-flex align-items-center justify-content-center w-100"
    >
      <div className={screens.lg ? "w-45" : "w-80"}>
        <Suspense fallback={<></>}>
          <SetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

export default SetPassword;
