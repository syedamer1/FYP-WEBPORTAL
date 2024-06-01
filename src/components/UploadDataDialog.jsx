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
import { useUser } from "@context/UserContext";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UploadDataDialog = ({ open, onClose }) => {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [diseaseOptions, setDiseaseOptions] = useState([]);

  const { user } = useUser();

  const fetchProvinces = debounce(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/province/getIdAndName"
      );
      setProvinceOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDivisions = debounce(async (provinceId) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/division/getDivisionsByProvinceIds",
        {
          params: { provinceIds: provinceId },
        }
      );
      setDivisionOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDistricts = debounce(async (divisionId) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/district/getDistrictsByDivisionIds",
        {
          params: { divisionIds: divisionId },
        }
      );
      setDistrictOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchTehsils = debounce(async (districtId) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/tehsil/getTehsilsByDistrictIds",
        {
          params: { districtIds: districtId },
        }
      );
      setTehsilOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchHospitals = debounce(async (tehsilId) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL +
          "/hospital/getHospitalsByTehsilIds",
        {
          params: { tehsilIds: tehsilId },
        }
      );
      setHospitalOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const fetchDisease = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_REACT_APP_BASEURL + "/disease/getIdAndName"
      );
      setDiseaseOptions(response.data);
    } catch (error) {
      console.error("Error fetching disease names:", error);
    }
  };

  useEffect(() => {
    if (user.usertype === userType.superAdmin) fetchProvinces();
    else if (
      user.usertype === userType.divisionAdmin ||
      user.usertype === userType.provinceAdmin
    )
      fetchDivisions([user.province.id]);
    else if (user.usertype === userType.districtAdmin)
      fetchDistricts([user.division.id]);
    else if (user.usertype === userType.tehsilAdmin)
      fetchTehsils([user.district.id]);
    else if (user.usertype === userType.hospitalAdmin)
      fetchHospitals([user.tehsil.id]);
    fetchDisease();
  }, []);

  const handleProvinceSelect = (event, newValue) => {
    setSelectedProvince(newValue);
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedHospital(null);
    if (newValue) {
      fetchDivisions([newValue.id]);
    } else {
      setDivisionOptions([]);
    }
  };

  const handleDivisionSelect = (event, newValue) => {
    setSelectedDivision(newValue);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedHospital(null);
    if (newValue) {
      fetchDistricts([newValue.id]);
    } else {
      setDistrictOptions([]);
    }
  };

  const handleDistrictSelect = (event, newValue) => {
    setSelectedDistrict(newValue);
    setSelectedTehsil(null);
    setSelectedHospital(null);
    if (newValue) {
      fetchTehsils([newValue.id]);
    } else {
      setTehsilOptions([]);
    }
  };

  const handleTehsilSelect = (event, newValue) => {
    setSelectedTehsil(newValue);
    setSelectedHospital(null);
    if (newValue) {
      fetchHospitals([newValue.id]);
    } else {
      setHospitalOptions([]);
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
    formData.append("hospitalId", selectedHospital?.id);
    formData.append("diseaseId", selectedDisease?.id);

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
    setProvinceOptions([]);
    setDivisionOptions([]);
    setDistrictOptions([]);
    setTehsilOptions([]);
    setHospitalOptions([]);
    setDiseaseOptions([]);
    setSelectedDivision(null);
    setSelectedDistrict(null);
    setSelectedTehsil(null);
    setSelectedProvince(null);
    setSelectedHospital(null);
    setSelectedFile(null);
    setSelectedDisease(null);
    onClose();
  };

  const renderAutocomplete = (
    label,
    options,
    value,
    onChange,
    disabled = false
  ) => (
    <Grid item xs={12} md={4}>
      <Autocomplete
        disablePortal
        options={options}
        value={value}
        onChange={onChange}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label={label} />}
        disabled={disabled}
      />
    </Grid>
  );

  const userType = {
    superAdmin: "Super Administrator",
    provinceAdmin: "Province Administrator",
    divisionAdmin: "Division Administrator",
    districtAdmin: "District Administrator",
    tehsilAdmin: "Tehsil Administrator",
    hospitalAdmin: "Hospital Administrator",
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
            {user.usertype === userType.superAdmin &&
              renderAutocomplete(
                "Province",
                provinceOptions,
                selectedProvince,
                handleProvinceSelect
              )}
            {(user.usertype === userType.superAdmin ||
              user.usertype === userType.provinceAdmin ||
              user.usertype === userType.divisionAdmin) &&
              renderAutocomplete(
                "Division",
                divisionOptions,
                selectedDivision,
                handleDivisionSelect,
                !selectedProvince && user.usertype === userType.superAdmin
              )}
            {(user.usertype === userType.superAdmin ||
              user.usertype === userType.provinceAdmin ||
              user.usertype === userType.divisionAdmin ||
              user.usertype === userType.districtAdmin) &&
              renderAutocomplete(
                "District",
                districtOptions,
                selectedDistrict,
                handleDistrictSelect,
                !selectedDivision &&
                  (user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin)
              )}
            {(user.usertype === userType.superAdmin ||
              user.usertype === userType.provinceAdmin ||
              user.usertype === userType.divisionAdmin ||
              user.usertype === userType.districtAdmin ||
              user.usertype === userType.tehsilAdmin) &&
              renderAutocomplete(
                "Tehsil",
                tehsilOptions,
                selectedTehsil,
                handleTehsilSelect,
                !selectedDistrict &&
                  (user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin ||
                    user.usertype === userType.divisionAdmin)
              )}
            {(user.usertype === userType.superAdmin ||
              user.usertype === userType.provinceAdmin ||
              user.usertype === userType.divisionAdmin ||
              user.usertype === userType.districtAdmin ||
              user.usertype === userType.tehsilAdmin ||
              user.usertype === userType.hospitalAdmin) &&
              renderAutocomplete(
                "Hospital",
                hospitalOptions,
                selectedHospital,
                handleHospitalSelect,
                !selectedTehsil &&
                  (user.usertype === userType.superAdmin ||
                    user.usertype === userType.provinceAdmin ||
                    user.usertype === userType.divisionAdmin ||
                    user.usertype === userType.districtAdmin)
              )}
            {renderAutocomplete(
              "Disease",
              diseaseOptions,
              selectedDisease,
              (event, newValue) => setSelectedDisease(newValue)
            )}
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
