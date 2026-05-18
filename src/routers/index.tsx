import { createBrowserRouter, Navigate } from "react-router-dom";
import publicRoutes from "./PublicRoutes";
import privateRoutes from "./PrivateRoutes";

const routes = [
  ...publicRoutes,
  ...privateRoutes,
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
];

export default createBrowserRouter(routes);
