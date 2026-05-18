import { RouteObject } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import ForceChangePassword from "../pages/auth/ForceChangePassword";

const publicRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-otp", element: <VerifyOtp /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/force-change-password", element: <ForceChangePassword /> },
];

export default publicRoutes;
