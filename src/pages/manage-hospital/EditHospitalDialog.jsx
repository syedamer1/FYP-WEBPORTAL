/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from "react";
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

const EditHospitalDialog = ({ open, onClose, hospital, tehsilOptions }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    address: "",
    hospitalType: "",
    tehsil: { id: "", name: "" },
  });

  useEffect(() => {
    if (hospital) {
      setFormData({
        id: hospital.id,
        name: hospital.name,
        code: hospital.code,
        address: hospital.address,
        hospitalType: hospital.hospitalType,
        tehsil: hospital.tehsil,
      });
    }
  }, [hospital]);

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
      id: formData.id,
      name: formData.name,
      code: formData.code,
      address: formData.address,
      hospitalType: formData.hospitalType,
      tehsil: { id: formData.tehsil.id },
    };
    try {
      await axios.put(`http://localhost:8080/hospital/update`, submitData);
      onClose();
    } catch (error) {
      console.error("Error updating hospital:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 2 }}>
          <DialogTitle variant="h3">Edit Hospital</DialogTitle>
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
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default EditHospitalDialog;

EditHospitalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hospital: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    address: PropTypes.string,
    hospitalType: PropTypes.string,
    tehsil: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  tehsilOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};
