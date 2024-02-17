import MainCard from "@components/CustomCard";
import HospitalTable from "./HospitalTable";
import { Grid, Typography } from "@mui/material/";

const ManageHospital = () => (
  <MainCard>
    <Typography variant="h3" sx={{ marginBottom: 2 }}>
      Manage Hospital
    </Typography>
    <Grid
      item
      md={8}
      sx={{ display: { sm: "none", md: "block", lg: "none" } }}
    />

    <HospitalTable />
  </MainCard>
);

export default ManageHospital;
