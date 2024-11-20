import React, { Suspense } from "react";
import { Grid } from "antd";
import { LoginForm } from "../components";
const { useBreakpoint } = Grid;

function Login() {
  const screens = useBreakpoint();

  return (
    <div
      style={{ height: screens.lg ? "80%" : "100%" }}
      className="d-flex align-items-center justify-content-center w-100"
    >
      <div className={screens.lg ? "w-45" : "w-80"}>
        <Suspense fallback={<></>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

export default Login;
