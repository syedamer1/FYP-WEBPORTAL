import MainLayout from "@layout/MainLayout";
import { lazy } from "react";
import CustomLoader from "@components/CustomLoader";

const Dashboard = CustomLoader(lazy(() => import("@pages/dashboard")));
const ManageAccounts = CustomLoader(
  lazy(() => import("@pages/manage-account"))
);
const ManageHospital = CustomLoader(
  lazy(() => import("@pages/manage-hospital"))
);
const ManageArea = CustomLoader(lazy(() => import("@pages/manage-area")));
const PredictiveAnalytics = CustomLoader(
  lazy(() => import("@pages/predictive-analytics"))
);

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      index: true,
      element: <Dashboard />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "manage-account",
      element: <ManageAccounts />,
    },
    {
      path: "manage-area",
      element: <ManageArea />,
    },
    {
      path: "predictive-analytics",
      element: <PredictiveAnalytics />,
    },
    {
      path: "manage-hospital",
      element: <ManageHospital />,
    },
  ],
};

export default MainRoutes;
