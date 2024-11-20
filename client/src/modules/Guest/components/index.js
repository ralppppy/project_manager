import { lazy } from "react";

const LoginForm = lazy(() => import("./LoginForm"));
const SetPasswordForm = lazy(() => import("./SetPasswordForm"));
const ForgotPasswordEmail = lazy(() => import("./ForgotPasswordEmail"));

export { LoginForm, SetPasswordForm, ForgotPasswordEmail };
