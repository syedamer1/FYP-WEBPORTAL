import { Box, Toolbar } from "@mui/material";
import Breadcrumbs from "@components/Breadcrumbs";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import pageinfo from "./pageinfo";

const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Header />
      <Box
        component="main"
        sx={{ width: "100%", flexGrow: 1, p: { xs: 2, sm: 3 } }}
      >
        <Toolbar />

        <Breadcrumbs pageinfo={pageinfo} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
