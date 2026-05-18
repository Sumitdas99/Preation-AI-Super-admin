import { RouteObject } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard";
import Violations from "../pages/Violations";
import EvidencePacks from "../pages/EvidencePacks";
import Policies from "../pages/Policies";
import AuditLog from "../pages/AuditLog";
import Settings from "../pages/Settings";
import BrandAdminRequests from "../pages/BrandAdminRequests";
import UserManagement from "../pages/UserManagement";
import SuperAdmin from "@/pages/SuperAdmin";
import SuperAdminBrandPacks from "@/pages/SuperAdminBrandPacks";
import SuperAdminBrandPackOnboard from "@/pages/SuperAdminBrandPackOnboard";

const privateRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/super-admin-console", element: <SuperAdmin /> },
      { path: "/violations", element: <Violations /> },
      { path: "/evidence", element: <EvidencePacks /> },
      { path: "/policies", element: <Policies /> },
      { path: "/audit", element: <AuditLog /> },
      { path: "/settings", element: <Settings /> },
      { path: "/brand-admin-requests", element: <BrandAdminRequests /> },
      { path: "/user-management", element: <UserManagement /> },
    ],
  },
  { path: "/super-admin/brand-packs", element: <SuperAdminBrandPacks /> },
  { path: "/super-admin/brand-packs/:brandId", element: <SuperAdminBrandPacks /> },
  { path: "/super-admin/brand-packs/new", element: <SuperAdminBrandPackOnboard /> },
];

export default privateRoutes;
