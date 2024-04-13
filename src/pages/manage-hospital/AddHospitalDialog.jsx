/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
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
import PropTypes from "prop-types";

const AddHospitalDialog = ({ open, onClose, tehsilOptions }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    hospitalType: "",
    tehsil: { id: "", name: "" },
  });

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const handleTehsilChange = (event, newValue) => {
    if (newValue === null) return;
    setFormData({
      ...formData,
      tehsil: { id: newValue.id, name: newValue.name },
    });
  };

  const handleSubmit = async () => {
    const submitData = {
      name: formData.name,
      code: formData.code,
      address: formData.address,
      hospitalType: formData.hospitalType,
      tehsil: { id: formData.tehsil.id },
    };
    try {
      await axios.post("http://localhost:8080/hospital/add", submitData);
      setFormData({
        name: "",
        code: "",
        address: "",
        hospitalType: "",
        tehsil: { id: "", name: "" },
      });
    } catch (error) {
      console.error("Error creating hospital:", error);
    }
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Add Hospital</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  margin="dense"
                  name="code"
                  label="Code"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.code}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="hospital-type-autocomplete"
                  value={formData.hospitalType}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, hospitalType: newValue });
                  }}
                  options={["Government", "Private"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hospital Type"
                      variant="outlined"
                    />
                  )}
                  gutterBottom
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="tehsil-autocomplete"
                  value={formData.tehsil}
                  onChange={handleTehsilChange}
                  options={tehsilOptions}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField {...params} label="Tehsil" variant="outlined" />
                  )}
                  gutterBottom
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="address"
                  label="Address"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
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

export default AddHospitalDialog;

AddHospitalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tehsilOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};
