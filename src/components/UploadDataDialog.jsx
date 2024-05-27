import { useState, useEffect, forwardRef } from "react";
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
import debounce from "lodash/debounce";

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

  const [provincesData, setProvincesData] = useState([]);
  const [divisionsData, setDivisionsData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [tehsilsData, setTehsilsData] = useState([]);
  const [hospitalsData, setHospitalsData] = useState([]);

  const fetchProvinces = debounce(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/get"
      );
      setProvincesData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDivisions = debounce(async (provinceIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/division/getDivisionsByProvinceIds",
        {
          params: { provinceIds: provinceIds.join(",") },
        }
      );
      setDivisionsData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDistricts = debounce(async (divisionIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/district/getDistrictsByDivisionIds",
        {
          params: { divisionIds: divisionIds.join(",") },
        }
      );
      setDistrictsData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchTehsils = debounce(async (districtIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/tehsil/getTehsilsByDistrictIds",
        {
          params: { districtIds: districtIds.join(",") },
        }
      );
      setTehsilsData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchHospitals = debounce(async (tehsilIds) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/hospital/getHospitalsByTehsilIds",
        {
          params: { tehsilIds: tehsilIds.join(",") },
        }
      );
      setHospitalsData(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleProvinceSelect = (event, newValue) => {
    setSelectedProvince(newValue);
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedHospital(null);
    if (newValue) {
      fetchDivisions([newValue.id]);
    }
  };

  const handleDivisionSelect = (event, newValue) => {
    setSelectedDivision(newValue);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedHospital(null);
    if (newValue) {
      fetchDistricts([newValue.id]);
    }
  };

  const handleDistrictSelect = (event, newValue) => {
    setSelectedDistrict(newValue);
    setSelectedTehsil(null);
    setSelectedHospital(null);
    if (newValue) {
      fetchTehsils([newValue.id]);
    }
  };

  const handleTehsilSelect = (event, newValue) => {
    setSelectedTehsil(newValue);
    setSelectedHospital(null);
    if (newValue) {
      fetchHospitals([newValue.id]);
    }
  };

  const handleHospitalSelect = (event, newValue) => {
    setSelectedHospital(newValue);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("hospitalId", selectedHospital?.id || 1);
    formData.append("diseaseId", 1);

    axios
      .post(
        import.meta.env.VITE_REACT_APP_BASEURL + "/patient/upload",
        formData
      )
      .then((response) => {
        console.log(response.data);
        handleClose();
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
                onChange={handleProvinceSelect}
                getOptionLabel={(option) => option.name}
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
                onChange={handleDivisionSelect}
                getOptionLabel={(option) => option.name}
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
                onChange={handleDistrictSelect}
                getOptionLabel={(option) => option.name}
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
                onChange={handleTehsilSelect}
                getOptionLabel={(option) => option.name}
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
                onChange={handleHospitalSelect}
                getOptionLabel={(option) => option.name}
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
                    <UploadFileIcon sx={{ marginRight: 1, fontSize: 30 }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {selectedFile.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ marginRight: 1, fontSize: 16 }}
                      >
                        {selectedFile.type}
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
