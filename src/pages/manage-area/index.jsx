import CustomCard from "@components/CustomCard";
import { Typography, Grid } from "@mui/material/";
import ProvinceTable from "./province/ProvinceTable";
import DivisionTable from "./division/DivisionTable";
import DistrictTable from "./district/DistrictTable";
import TehsilTable from "./tehsil/TehsilTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ManageArea = () => {
  const provinceQueryClient = new QueryClient();
  const divisionQueryClient = new QueryClient();
  const districtQueryClient = new QueryClient();
  const tehsilQueryClient = new QueryClient();

  return (
    <>
      <Grid item xs={12} sm={6} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Manage Area</Typography>
      </Grid>
      <CustomCard sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Province
        </Typography>
        <QueryClientProvider client={provinceQueryClient}>
          <ProvinceTable />
        </QueryClientProvider>
      </CustomCard>
      <CustomCard sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Division
        </Typography>
        <QueryClientProvider client={divisionQueryClient}>
          <DivisionTable />
        </QueryClientProvider>
      </CustomCard>
      <CustomCard sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage District
        </Typography>
        <QueryClientProvider client={districtQueryClient}>
          <DistrictTable />
        </QueryClientProvider>
      </CustomCard>
      <CustomCard sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Tehsil
        </Typography>
        <QueryClientProvider client={tehsilQueryClient}>
          <TehsilTable />
        </QueryClientProvider>
      </CustomCard>
    </>
  );
};

export default ManageArea;
