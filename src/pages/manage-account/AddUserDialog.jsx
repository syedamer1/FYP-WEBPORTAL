/* eslint-disable react/prop-types */
import { useState } from "react";
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
} from "@mui/material";

function AddUserDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userType: "",
    additionalInfo: "",
    contact: "",
    email: "",
    password: "",
  });

  const userTypes = [
    "Super Administrator",
    "Province Administrator",
    "Division Administrator",
    "District Administrator",
    "Tehsil Administrator",
    "Hospital Administrator",
  ];

  const additionalFieldMapping = {
    "Province Administrator": "Select Province",
    "Division Administrator": "Select Division",
    "District Administrator": "Select District",
    "Tehsil Administrator": "Select Tehsil",
    "Hospital Administrator": "Select Hospital",
  };

  const additionalOptions = {
    "Select Division": ["Division 1", "Division 2", "Division 3"],
    "Select District": ["District 1", "District 2", "District 3"],
    "Select Tehsil": ["Tehsil 1", "Tehsil 2", "Tehsil 3"],
    "Select Hospital": ["Hospital 1", "Hospital 2", "Hospital 3"],
    "Select Province": ["Province 1", "Province 2", "Province 3"],
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (event, newValue) => {
    setFormData({ ...formData, userType: newValue, additionalInfo: "" });
  };

  const handleAdditionalInfoChange = (event, newValue) => {
    setFormData({ ...formData, additionalInfo: newValue });
  };

  const handleSubmit = () => {
    console.log(formData);
    onClose();
  };

  const additionalInfoLabel = additionalFieldMapping[formData.userType];

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disablePortal
                id="user-type-autocomplete"
                value={formData.userType}
                onChange={handleUserTypeChange}
                options={userTypes}
                renderInput={(params) => (
                  <TextField {...params} label="User Type" variant="outlined" />
                )}
              />
            </Grid>
            {additionalInfoLabel && (
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="additional-info-autocomplete"
                  value={formData.additionalInfo}
                  onChange={handleAdditionalInfoChange}
                  options={additionalOptions[additionalInfoLabel]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={additionalInfoLabel}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="contact"
                label="Contact"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default AddUserDialog;
