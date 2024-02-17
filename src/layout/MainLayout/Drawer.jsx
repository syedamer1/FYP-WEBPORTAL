import {
  Box,
  Divider,
  Drawer,
  TextField,
  Autocomplete,
  Typography,
  useTheme,
} from "@mui/material";
import CustomAutocomplete from "@components/CustomAutoComplete";
import TuneIcon from "@mui/icons-material/Tune";
import PropTypes from "prop-types";

const DrawerComponent = ({ open, onClose }) => {
  const data = ["Male", "Female", "Both"];
  const provinceData = [
    { label: "Province A", id: 1 },
    { label: "Province B", id: 2 },
    { label: "Province C", id: 3 },
  ];

  const divisionData = [
    { label: "Division X", id: 1 },
    { label: "Division Y", id: 2 },
    { label: "Division Z", id: 3 },
  ];

  const districtData = [
    { label: "District 1", id: 1 },
    { label: "District 2", id: 2 },
    { label: "District 3", id: 3 },
  ];

  const tehsilData = [
    { label: "Tehsil Alpha", id: 1 },
    { label: "Tehsil Beta", id: 2 },
    { label: "Tehsil Gamma", id: 3 },
  ];

  const hospitalData = [
    { label: "Hospital Green", id: 1 },
    { label: "Hospital Blue", id: 2 },
    { label: "Hospital Red", id: 3 },
  ];

  const diseaseSymptomsData = [
    { label: "Fever", id: 1 },
    { label: "Cough", id: 2 },
    { label: "Fatigue", id: 3 },
  ];

  const theme = useTheme();

  const patientSymptomsData = [
    { label: "Headache", id: 1 },
    { label: "Dizziness", id: 2 },
    { label: "Nausea", id: 3 },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      BackdropProps={{ invisible: true }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: open ? 290 : 0,
          minWidth: 290,
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundImage: "none",
          boxShadow: "none",
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          "& .MuiBackdrop-root": {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      <Box sx={{ width: 290, padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <TuneIcon sx={{ marginRight: 1 }} />
          <Typography variant="h3" sx={{ marginTop: 1.5 }} gutterBottom>
            Filters Drawer
          </Typography>
        </Box>
        <Typography variant="h5" gutterBottom>
          Province
        </Typography>
        <CustomAutocomplete data={provinceData} placeholder="Select Province" />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Division
        </Typography>
        <CustomAutocomplete data={divisionData} placeholder="Select Division" />
        <Divider />
        <Typography variant="h5" gutterBottom>
          District
        </Typography>
        <CustomAutocomplete data={districtData} placeholder="Select District" />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Tehsil
        </Typography>
        <CustomAutocomplete data={tehsilData} placeholder="Select Tehsil" />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Hospital
        </Typography>
        <CustomAutocomplete data={hospitalData} placeholder="Select Hospital" />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Gender
        </Typography>
        <Autocomplete
          fullWidth
          disablePortal
          id="basic-autocomplete"
          options={data}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Gender"
              sx={{ width: "235px" }}
            />
          )}
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Disease Symptoms
        </Typography>
        <CustomAutocomplete
          data={diseaseSymptomsData}
          placeholder="Select Disease Symptoms"
        />
        <Divider />
        <Typography variant="h5" gutterBottom>
          Patient Symptoms
        </Typography>
        <CustomAutocomplete
          data={patientSymptomsData}
          placeholder="Select Patient Symptoms"
        />
      </Box>
    </Drawer>
  );
};

DrawerComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DrawerComponent;
