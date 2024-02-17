/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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
import axios from "axios";
function AddHospitalDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    id: "1",
    name: "",
    code: "",
    address: "",
    hospital_type: "",
    tehsil_id: "",
  });

  const hospitalTypes = ["Government", "Private"];
  const [tehsilOptions, setTehsilOptions] = useState([]);
  useEffect(() => {
    const fetchTehsilOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/tehsil/getIdAndName"
        );
        setTehsilOptions(response.data);
      } catch (error) {
        console.error("Error fetching tehsil information:", error);
      }
    };
    fetchTehsilOptions();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHospitalTypeChange = (event, newValue) => {
    setFormData({ ...formData, hospital_type: newValue });
  };

  const handleTehsilNameChange = (event, newValue) => {
    setFormData({ ...formData, tehsil_name: newValue });
  };

  const handleSubmit = () => {
    console.log(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add New Hospital</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="normal"
                name="name"
                label="Hospital Name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
                value={formData.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                name="code"
                label="Hospital Code"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
                value={formData.code}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="address"
                label="Hospital Address"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
                value={formData.address}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disablePortal
                id="hospital-type-autocomplete"
                onChange={handleHospitalTypeChange}
                options={hospitalTypes}
                value={formData.hospital_type}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="hospital_type"
                    label="Hospital Type"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="tehsil_id"
                type="hidden"
                value={formData.tehsil_id}
              />
              <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="tehsil-name-autocomplete"
                  onChange={handleTehsilNameChange}
                  options={tehsilOptions}
                  getOptionLabel={(option) => option.name}
                  value={
                    tehsilOptions.find(
                      (option) => option.id === formData.tehsil_id
                    ) || null
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="tehsil_name"
                      label="Tehsil Name"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
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

export default AddHospitalDialog;
