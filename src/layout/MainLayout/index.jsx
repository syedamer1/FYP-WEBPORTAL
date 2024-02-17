import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Breadcrumbs from "@components/Breadcrumbs";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import Drawer from "./Drawer";
import CustomButton from "@components/CustomButtom";
import pageinfo from "./pageinfo";

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const shouldShowButton =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("predictive-analytics");

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Header />
      <Box
        component="main"
        sx={{ width: "100%", flexGrow: 1, p: { xs: 2, sm: 3 } }}
      >
        <Toolbar />
        {shouldShowButton && (
          <CustomButton onButtonClick={toggleDrawer} buttonOpen={drawerOpen} />
        )}
        <Breadcrumbs pageinfo={pageinfo} />
        <Outlet />
      </Box>
      <Drawer open={drawerOpen} onClose={toggleDrawer} />
    </Box>
  );
};

export default MainLayout;
