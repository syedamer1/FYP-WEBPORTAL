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
import PropTypes from "prop-types";

function AddDivisionDialog({ open, onClose }) {
  const [formData, setFormData] = useState({
    divisionName: "",
    province: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log(formData); // Replace with your submission logic
    onClose();
  };

  const data = [
    { label: "Province 1", value: 1 },
    { label: "Province 2", value: 2 },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add New Division</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Division Name */}
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                name="Name"
                label="Name"
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
                id="province-autocomplete"
                options={data}
                getOptionLabel={(option) => option.label}
                onChange={(e, newValue) => {
                  setFormData({
                    ...formData,
                    province: newValue?.value || null,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Province" />
                )}
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

AddDivisionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddDivisionDialog;
