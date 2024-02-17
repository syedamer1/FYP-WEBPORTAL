import MainCard from "@components/CustomCard";
import AccountTable from "./AccountTable";
import { Grid, Typography } from "@mui/material/";

const ManageAccount = () => (
  <MainCard>
    <Typography variant="h3" sx={{ marginBottom: 2 }}>
      Manage Account
    </Typography>
    <Grid
      item
      md={8}
      sx={{ display: { sm: "none", md: "block", lg: "none" } }}
    />

    <AccountTable />
  </MainCard>
);

export default ManageAccount;
