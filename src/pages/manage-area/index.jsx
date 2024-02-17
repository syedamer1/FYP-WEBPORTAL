import CustomCard from "@components/CustomCard";
import { Typography, Grid } from "@mui/material/";
import ProvinceTable from "./province/ProvinceTable";
import DivisionTable from "./division/DivisionTable";
import DistrictTable from "./district/DistrictTable";
import TehsilTable from "./tehsil/TehsilTable";

const managearea = () => (
  <>
    <Grid item xs={12} sm={6} sx={{ mb: -2.25 }}>
      <Typography variant="h5">Manage Area</Typography>
    </Grid>
    <CustomCard sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Manage Province
      </Typography>
      <ProvinceTable />
    </CustomCard>
    <CustomCard sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Manage Division
      </Typography>
      <DivisionTable />
    </CustomCard>
    <CustomCard sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Manage District
      </Typography>
      <DistrictTable />
    </CustomCard>
    <CustomCard sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Manage Tehsil
      </Typography>
      <TehsilTable />
    </CustomCard>
  </>
);

export default managearea;
