import { Box, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const CenteredAlert = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "54vh",
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <WarningIcon sx={{ fontSize: 150, color: "red" }} />
      <Typography variant="h4" mt={2} sx={{ textAlign: "center" }}>
        Select Disease to view Real Time Analytics
      </Typography>
    </Box>
  );
};

export default CenteredAlert;
