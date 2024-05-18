import { useState, useEffect, useCallback, useMemo } from "react";
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
  const initialState = useMemo(
    () => ({
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
    }),
    []
  );

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
        const endpoints = [
          "tehsil/getIdAndName",
          "division/getIdAndName",
          "district/getIdAndName",
          "province/getIdAndName",
          "hospital/getIdAndName",
        ];

        const [
          tehsilData,
          divisionData,
          districtData,
          provinceData,
          hospitalData,
        ] = await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(`http://localhost:8080/${endpoint}`)
          )
        );

        setTehsilOptions(tehsilData.data);
        setDivisionOptions(divisionData.data);
        setDistrictOptions(districtData.data);
        setProvinceOptions(provinceData.data);
        setHospitalOptions(hospitalData.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (open) {
      fetchOptions();
    }
  }, [open, initialState]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleUserTypeChange = (e, newValue) => {
    setFormData((prevData) => ({ ...prevData, usertype: newValue || "" }));
    setSelectedArea({ id: "", name: "" });
    const optionsMap = {
      "Tehsil Administrator": tehsilOptions,
      "Division Administrator": divisionOptions,
      "District Administrator": districtOptions,
      "Province Administrator": provinceOptions,
      "Hospital Administrator": hospitalOptions,
    };
    setAreaOptions(optionsMap[newValue] || []);
  };

  const handleAreaChange = (event, newValue) => {
    setSelectedArea(newValue || null);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    const submitData = {
      ...formData,
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
      setFormData({ ...initialState });
      setSelectedArea(null);
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {["firstName", "lastName", "cnic", "contact"].map((field) => (
              <Grid item xs={6} key={field}>
                <TextField
                  margin="dense"
                  name={field}
                  label={field.replace(/^\w/, (c) => c.toUpperCase())}
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData[field]}
                  onChange={handleInputChange}
                />
              </Grid>
            ))}
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
                  <TextField {...params} label="User Type" variant="outlined" />
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
  );
};

AddUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddUserDialog;
