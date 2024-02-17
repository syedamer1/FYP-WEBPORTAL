import { useState, forwardRef } from "react";
import {
  Dialog,
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Button,
  DialogActions,
  Box,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PropTypes from "prop-types";
import Slide from "@mui/material/Slide";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const UploadDataDialog = ({ open, onClose }) => {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const divisionsData = ["Division A", "Division B", "Division C"];

  const districtsData = ["District A", "District B", "District C"];

  const tehsilsData = ["Tehsil A", "Tehsil B", "Tehsil C"];

  const provincesData = ["Province A", "Province B", "Province C"];

  const hospitalsData = ["Hospital A", "Hospital B", "Hospital C"];

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      maxWidth="sm"
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3" sx={{ mb: 0 }}>
          Upload Data
        </DialogTitle>
        <DialogContent sx={{ mb: 0 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Row 1 */}

            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="division-autocomplete"
                options={divisionsData}
                value={selectedDivision}
                onChange={(event, newValue) => setSelectedDivision(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Province" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="district-autocomplete"
                options={districtsData}
                value={selectedDistrict}
                onChange={(event, newValue) => setSelectedDistrict(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Division" />
                )}
              />
            </Grid>
            {/* Row 2 */}
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="tehsil-autocomplete"
                options={tehsilsData}
                value={selectedTehsil}
                onChange={(event, newValue) => setSelectedTehsil(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="District" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="province-autocomplete"
                options={provincesData}
                value={selectedProvince}
                onChange={(event, newValue) => setSelectedProvince(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Tehsil" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="hospital-autocomplete"
                options={hospitalsData}
                value={selectedHospital}
                onChange={(event, newValue) => setSelectedHospital(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Hospital" />
                )}
              />
            </Grid>

            {/* Upload Section */}
            <Grid item xs={12}>
              <Box
                border={2}
                borderColor="primary.main"
                borderRadius={2}
                padding={4}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="grey.100"
                sx={{
                  cursor: "pointer",
                  minHeight: "200px",
                  borderStyle: "dashed",
                  borderWidth: "2px",
                  borderColor: "black",
                }}
                onClick={() =>
                  document.getElementById("file-upload-input").click()
                }
              >
                <CloudUploadIcon
                  style={{ fontSize: 60, color: "primary.main" }}
                />
                <Typography variant="h6" style={{ marginTop: 16 }}>
                  Drop files here or click to browse through your machine
                </Typography>
                <input type="file" id="file-upload-input" hidden />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onClose} color="primary" variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

UploadDataDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default UploadDataDialog;
