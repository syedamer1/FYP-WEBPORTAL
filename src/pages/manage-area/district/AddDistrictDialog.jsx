import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  Box,
  Grid,
} from "@mui/material";
import PropTypes from "prop-types";

function AddDistrictDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    division: "",
  });

  const handleChange = (e, value) => {
    if (value) {
      setFormData({ ...formData, division: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    console.log(formData); // Replace with your submission logic
    onClose();
  };

  const data = [
    { label: "Division A" },
    { label: "Division B" },
    { label: "Division C" },
    { label: "Division D" },
    { label: "Division E" },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add New District</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            {/* Division */}
            <Grid item xs={12}>
              <Autocomplete
                fullWidth
                disablePortal
                id="basic-autocomplete-label"
                options={data}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Division" />
                )}
                onChange={(event, value) => handleChange(event, value)}
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

AddDistrictDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddDistrictDialog;
