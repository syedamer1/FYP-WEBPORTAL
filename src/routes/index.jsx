import { useRoutes } from 'react-router-dom';
import MainRoutes from './MainRoutes';
import LoginRoute from './LoginRoute';
const Routes = () => {
  return useRoutes([LoginRoute,MainRoutes]);
};

export default Routes;
