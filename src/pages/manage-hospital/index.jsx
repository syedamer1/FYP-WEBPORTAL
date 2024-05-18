import MainCard from "@components/CustomCard";
import HospitalTable from "./HospitalTable";
import { Grid, Typography } from "@mui/material/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ManageHospital = () => {
  const queryClient = new QueryClient();

  return (
    <>
      <MainCard>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Hospital
        </Typography>
        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />
        <QueryClientProvider client={queryClient}>
          <HospitalTable />
        </QueryClientProvider>
      </MainCard>
    </>
  );
};

export default ManageHospital;
