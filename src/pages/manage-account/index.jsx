import MainCard from "@components/CustomCard";
import AccountTable from "./AccountTable";
import { Grid, Typography } from "@mui/material/";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const ManageAccount = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <MainCard>
        <Typography variant="h3" sx={{ marginBottom: 2 }}>
          Manage Account
        </Typography>
        <Grid
          item
          md={8}
          sx={{ display: { sm: "none", md: "block", lg: "none" } }}
        />
        <QueryClientProvider client={queryClient}>
          <AccountTable />
        </QueryClientProvider>
      </MainCard>
    </>
  );
};

export default ManageAccount;
