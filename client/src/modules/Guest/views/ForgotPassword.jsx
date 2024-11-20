import React, { Suspense } from "react";
import { ForgotPasswordEmail } from "../components";
import { Grid } from "antd";
const { useBreakpoint } = Grid;

function ForgotPassword() {
  const screens = useBreakpoint();
  return (
    <div
      style={{ height: screens.lg ? "80%" : "100%" }}
      className="d-flex align-items-center justify-content-center w-100"
    >
      <div className={screens.lg ? "w-45" : "w-80"}>
        <Suspense fallback={<></>}>
          <ForgotPasswordEmail />
        </Suspense>
      </div>
    </div>
  );
}

export default ForgotPassword;
