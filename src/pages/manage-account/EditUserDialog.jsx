/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
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
import PropTypes from "prop-types";

const EditUserDialog = ({
  open,
  onClose,
  userData,
  tehsilOptions,
  divisionOptions,
  districtOptions,
  provinceOptions,
  hospitalOptions,
}) => {
  const [formData, setFormData] = useState({
    id: "",
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
  const [showPassword, setShowPassword] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState({
    id: "",
    name: "",
  });
  const [headerVisible, setHeaderVisible] = useState(true); // State to track header visibility
  const [storedHeader, setStoredHeader] = useState(null); // State to store the header before removing it

  useEffect(() => {
    if (userData) {
      setFormData({ ...userData });
      const userTypeData = {
        "Tehsil Administrator": userData.tehsil,
        "Division Administrator": userData.division,
        "District Administrator": userData.district,
        "Province Administrator": userData.province,
        "Hospital Administrator": userData.hospital,
      };
      const selectedAreaData = userTypeData[userData.usertype] || {
        id: "",
        name: "",
      };
      setSelectedArea(selectedAreaData);

      setAreaOptions(getAreaOptions(userData.usertype));
    }
  }, [userData]);

  const getAreaOptions = (userType) => {
    switch (userType) {
      case "Tehsil Administrator":
        return tehsilOptions;
      case "Division Administrator":
        return divisionOptions;
      case "District Administrator":
        return districtOptions;
      case "Province Administrator":
        return provinceOptions;
      case "Hospital Administrator":
        return hospitalOptions;
      default:
        return [];
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleUserTypeChange = (event, newValue) => {
    if (!newValue) return;
    setFormData((prevFormData) => ({
      ...prevFormData,
      usertype: newValue,
    }));
    setSelectedArea({ id: "", name: "" });
    setAreaOptions(getAreaOptions(newValue));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    const submitData = {
      id: formData.id,
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
      await axios.put(`http://localhost:8080/user/update`, submitData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Edit Account</DialogTitle>
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
                    onChange={(event, newValue) => {
                      setSelectedArea({ id: newValue.id, name: newValue.name });
                    }}
                    options={areaOptions}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`${formData.usertype.replace(
                          " Administrator",
                          ""
                        )} Name`}
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
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default EditUserDialog;

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    cnic: PropTypes.string,
    email: PropTypes.string,
    contact: PropTypes.string,
    password: PropTypes.string,
    usertype: PropTypes.string,
    tehsil: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    division: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    district: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    province: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    hospital: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
};
