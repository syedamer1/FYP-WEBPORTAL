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

const EditUserDialog = ({ open, onClose, refresh, account }) => {
  const [formData, setFormData] = useState(account);
  const [showPassword, setShowPassword] = useState(false);
  const [areaOptions, setAreaOptions] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);

  const endpoints = useMemo(
    () => ({
      "Tehsil Administrator": "tehsil/getIdAndName",
      "Division Administrator": "division/getIdAndName",
      "District Administrator": "district/getIdAndName",
      "Province Administrator": "province/getIdAndName",
      "Hospital Administrator": "hospital/getIdAndName",
    }),
    []
  );

  const [options, setOptions] = useState({
    tehsilOptions: [],
    divisionOptions: [],
    districtOptions: [],
    provinceOptions: [],
    hospitalOptions: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const responses = await Promise.all(
          Object.values(endpoints).map((endpoint) =>
            axios.get(import.meta.env.VITE_REACT_APP_BASEURL + "/" + endpoint)
          )
        );

        setOptions({
          tehsilOptions: responses[0].data,
          divisionOptions: responses[1].data,
          districtOptions: responses[2].data,
          provinceOptions: responses[3].data,
          hospitalOptions: responses[4].data,
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (open) {
      fetchOptions();
    }
  }, [open, endpoints]);

  useEffect(() => {
    const userType = formData.usertype;
    const areaOptionsMap = {
      "Tehsil Administrator": options.tehsilOptions,
      "Division Administrator": options.divisionOptions,
      "District Administrator": options.districtOptions,
      "Province Administrator": options.provinceOptions,
      "Hospital Administrator": options.hospitalOptions,
    };

    setAreaOptions(areaOptionsMap[userType] || []);
    if (!areaOptionsMap[userType]) {
      setSelectedArea(null);
    }
  }, [formData.usertype, options]);

  useEffect(() => {
    const { usertype } = formData;
    if (usertype === "Super Administrator") {
      setSelectedArea(null);
    } else {
      const initialArea =
        account[usertype.toLowerCase().replace(" administrator", "")];
      if (initialArea) {
        setSelectedArea({ id: initialArea.id, name: initialArea.name });
      }
    }
  }, [account, formData.usertype]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleUserTypeChange = (event, newValue) => {
    setFormData((prevData) => ({ ...prevData, usertype: newValue || "" }));
    setSelectedArea(null);
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
          ? { id: selectedArea?.id }
          : null,
      division:
        formData.usertype === "Division Administrator"
          ? { id: selectedArea?.id }
          : null,
      district:
        formData.usertype === "District Administrator"
          ? { id: selectedArea?.id }
          : null,
      province:
        formData.usertype === "Province Administrator"
          ? { id: selectedArea?.id }
          : null,
      hospital:
        formData.usertype === "Hospital Administrator"
          ? { id: selectedArea?.id }
          : null,
    };

    try {
      await axios.put(
        import.meta.env.VITE_REACT_APP_BASEURL + "/user/update",
        submitData
      );
      refresh();
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit User</DialogTitle>
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
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

EditUserDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

export default EditUserDialog;
