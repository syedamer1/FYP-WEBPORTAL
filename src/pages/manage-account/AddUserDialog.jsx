import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Autocomplete,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const AddUserDialog = ({ open, onClose, refresh }) => {
  const initialState = {
    firstName: "",
    lastName: "",
    cnic: "",
    email: "",
    contact: "",
    password: "",
    usertype: "Super Administrator",
    tehsil: { id: "", name: "" },
    division: { id: "", name: "" },
    district: { id: "", name: "" },
    province: { id: "", name: "" },
    hospital: { id: "", name: "" },
  };
  const [formData, setFormData] = useState({ ...initialState });
  const [showPassword, setShowPassword] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [hospitalOptions, setHospitalOptions] = useState([]);

  useEffect(() => {
    setFormData({ ...initialState });
    const fetchOptions = async () => {
      try {
        // Fetch Tehsil options
        const tehsilResponse = await axios
          .get("http://localhost:8080/tehsil/getIdAndName")
          .catch((error) => ({ error }));
        if (tehsilResponse.error)
          throw new Error(
            `Error fetching Tehsil options: ${tehsilResponse.error}`
          );
        console.log(tehsilResponse.data);
        setTehsilOptions(tehsilResponse.data);

        // Fetch Division options
        const divisionResponse = await axios
          .get("http://localhost:8080/division/getIdAndName")
          .catch((error) => ({ error }));
        if (divisionResponse.error)
          throw new Error(
            `Error fetching Division options: ${divisionResponse.error}`
          );
        console.log(divisionResponse.data);
        setDivisionOptions(divisionResponse.data);

        // Fetch District options
        const districtResponse = await axios
          .get("http://localhost:8080/district/getIdAndName")
          .catch((error) => ({ error }));
        if (districtResponse.error)
          throw new Error(
            `Error fetching District options: ${districtResponse.error}`
          );
        console.log(districtResponse.data);
        setDistrictOptions(districtResponse.data);

        // Fetch Province options
        const provinceResponse = await axios
          .get("http://localhost:8080/province/getIdAndName")
          .catch((error) => ({ error }));
        if (provinceResponse.error)
          throw new Error(
            `Error fetching Province options: ${provinceResponse.error}`
          );
        console.log(provinceResponse.data);
        setProvinceOptions(provinceResponse.data);

        // Fetch Hospital options
        const hospitalResponse = await axios
          .get("http://localhost:8080/hospital/getIdAndName")
          .catch((error) => ({ error }));
        if (hospitalResponse.error)
          throw new Error(
            `Error fetching Hospital options: ${hospitalResponse.error}`
          );
        console.log(hospitalResponse.data);
        setHospitalOptions(hospitalResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (open) {
      fetchOptions();
    }
  }, [open]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleUserTypeChange = (e, newValue) => {
    if (!newValue) {
      setFormData((prevData) => ({
        ...prevData,
        usertype: "",
      }));
      console.log("No value selected");
      setSelectedArea({ id: "", name: "" });
      setAreaOptions([]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        usertype: newValue,
      }));
      console.log("Selected value:", newValue);
      console.log(divisionOptions);
      switch (newValue) {
        case "Tehsil Administrator":
          setAreaOptions(tehsilOptions);
          break;
        case "Division Administrator":
          setAreaOptions(divisionOptions);
          break;
        case "District Administrator":
          setAreaOptions(districtOptions);
          break;
        case "Province Administrator":
          setAreaOptions(provinceOptions);
          break;
        case "Hospital Administrator":
          setAreaOptions(hospitalOptions);
          break;
        default:
          setAreaOptions([]);
          setSelectedArea(null);
      }
    }
  };

  const handleAreaChange = (event, newValue) => {
    if (!newValue) {
      setSelectedArea(null);
    } else {
      setSelectedArea(newValue);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    const submitData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      cnic: formData.cnic,
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
      usertype: formData.usertype,
      tehsil:
        formData.usertype === "Tehsil Administrator"
          ? { id: selectedArea.id }
          : null,
      division:
        formData.usertype === "Division Administrator"
          ? { id: selectedArea.id }
          : null,
      district:
        formData.usertype === "District Administrator"
          ? { id: selectedArea.id }
          : null,
      province:
        formData.usertype === "Province Administrator"
          ? { id: selectedArea.id }
          : null,
      hospital:
        formData.usertype === "Hospital Administrator"
          ? { id: selectedArea.id }
          : null,
    };
    try {
      await axios.post("http://localhost:8080/user/add", submitData);
      setFormData({
        firstName: "",
        lastName: "",
        cnic: "",
        email: "",
        contact: "",
        password: "",
        usertype: "",
        tehsil: { id: "", name: "" },
        division: { id: "", name: "" },
        district: { id: "", name: "" },
        province: { id: "", name: "" },
        hospital: { id: "", name: "" },
      });
      setSelectedArea(null);
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Add User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="firstName"
                  label="First Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="cnic"
                  label="CNIC"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.cnic}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="contact"
                  label="Contact"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                item
                xs={formData.usertype === "Super Administrator" ? 12 : 6}
              >
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="user-type-autocomplete"
                  value={formData.usertype}
                  onChange={handleUserTypeChange}
                  options={[
                    "Super Administrator",
                    "Province Administrator",
                    "Division Administrator",
                    "District Administrator",
                    "Tehsil Administrator",
                    "Hospital Administrator",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="User Type"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              {formData.usertype !== "Super Administrator" && (
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="area-autocomplete"
                    value={selectedArea}
                    onChange={handleAreaChange}
                    options={areaOptions}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={formData.usertype.replace(" Administrator", "")}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={formData.password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddUserDialog;
