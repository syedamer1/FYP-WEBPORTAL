import { useRoutes } from "react-router-dom";
import MainRoutes from "./MainRoutes";
import LoginRoute from "./LoginRoute";
import NotFoundPage from "../pages/extra/NotFoundPage";
const Routes = () => {
  return useRoutes([
    LoginRoute,
    MainRoutes,
    { path: "*", element: <NotFoundPage /> },
  ]);
};

export default Routes;
