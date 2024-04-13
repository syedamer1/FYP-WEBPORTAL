import { useState, forwardRef } from "react";
import {
  Dialog,
  Autocomplete,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PropTypes from "prop-types";
import Slide from "@mui/material/Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UploadDataDialog = ({ open, onClose }) => {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const divisionsData = ["Division A", "Division B", "Division C"];
  const districtsData = ["District A", "District B", "District C"];
  const tehsilsData = ["Tehsil A", "Tehsil B", "Tehsil C"];
  const provincesData = ["Province A", "Province B", "Province C"];
  const hospitalsData = ["Hospital A", "Hospital B", "Hospital C"];

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:8080/upload", formData)
      .then((response) => {
        console.log(response.data); // Handle response from backend
        handleClose(); // Close dialog after successful upload
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleClose = () => {
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedProvince(null);
    setSelectedHospital(null);
    setSelectedFile(null);
    onClose();
  };
  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      maxWidth="sm"
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3" sx={{ mb: 0 }}>
          Upload Data
        </DialogTitle>
        <DialogContent sx={{ mb: 0 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="province-autocomplete"
                options={provincesData}
                value={selectedProvince}
                onChange={(event, newValue) => {
                  setSelectedProvince(newValue);
                  setSelectedDivision(null);
                  setSelectedDistrict(null);
                  setSelectedTehsil(null);
                  setSelectedHospital(null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Province" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="division-autocomplete"
                options={divisionsData}
                value={selectedDivision}
                onChange={(event, newValue) => {
                  setSelectedDivision(newValue);
                  setSelectedDistrict(null);
                  setSelectedTehsil(null);
                  setSelectedHospital(null);
                }}
                disabled={!selectedProvince}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Division"
                    disabled={!selectedProvince}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="district-autocomplete"
                options={districtsData}
                value={selectedDistrict}
                onChange={(event, newValue) => {
                  setSelectedDistrict(newValue);
                  setSelectedTehsil(null);
                  setSelectedHospital(null);
                }}
                disabled={!selectedDivision}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="District"
                    disabled={!selectedDivision}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                id="tehsil-autocomplete"
                options={tehsilsData}
                value={selectedTehsil}
                onChange={(event, newValue) => {
                  setSelectedTehsil(newValue);
                  setSelectedHospital(null);
                }}
                disabled={!selectedDistrict}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tehsil"
                    disabled={!selectedDistrict}
                  />
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
                disabled={!selectedTehsil}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hospital"
                    disabled={!selectedTehsil}
                  />
                )}
              />
            </Grid>
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
                onClick={() => {
                  if (selectedFile == null)
                    document.getElementById("file-upload-input").click();
                }}
              >
                <CloudUploadIcon
                  style={{ fontSize: 60, color: "primary.main" }}
                />
                <Typography variant="h6" style={{ marginTop: 16 }}>
                  Drop file here or click to browse through your machine
                </Typography>
                {selectedFile == null && (
                  <input
                    type="file"
                    id="file-upload-input"
                    hidden
                    onChange={handleFileChange}
                  />
                )}
              </Box>
              {selectedFile && (
                <Box mt={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    border={1}
                    borderColor="black"
                    borderRadius={2}
                    padding={1}
                  >
                    <UploadFileIcon sx={{ marginRight: 1, fontSize: 30 }} />{" "}
                    {/* Increase the icon size */}
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {selectedFile.name}
                      </Typography>
                      {/* Make the file name bold and bigger */}
                      <Typography
                        variant="body2"
                        sx={{ marginRight: 1, fontSize: 16 }}
                      >
                        {selectedFile.type} {/* Show format under the name */}
                      </Typography>
                    </Box>
                    <Button
                      onClick={() => setSelectedFile(null)}
                      variant="text"
                      color="error"
                      sx={{ marginLeft: "auto" }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" variant="contained">
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
