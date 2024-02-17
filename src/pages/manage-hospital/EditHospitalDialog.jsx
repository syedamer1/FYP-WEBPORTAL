import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

// eslint-disable-next-line react/prop-types
const EditHospitalDialog = ({ open, onClose, initialData }) => {
  const [values, setValues] = useState({
    id: "",
    name: "",
    address: "",
    hospital_type: "",
    tehsil_name: "",
    code: "",
    createdAt: "",
  });

  useEffect(() => {
    if (initialData) {
      setValues({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (prop) => (event, newValue) => {
    setValues({ ...values, [prop]: newValue || event.target.value });
  };

  const handleSave = () => {
    console.log("Updated values:", values);
    onClose();
  };

  const tehsilOptions = ["Tehsil 1", "Tehsil 2", "Tehsil 3"];
  const hospitalTypeOptions = ["Government", "Private"];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="edit-hospital-dialog"
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit Hospital</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="ID"
                value={values.id}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Name"
                value={values.name}
                onChange={handleChange("name")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Address"
                value={values.address}
                onChange={handleChange("address")}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                options={hospitalTypeOptions}
                value={values.hospital_type}
                onChange={handleChange("hospital_type")}
                renderInput={(params) => (
                  <TextField {...params} label="Hospital Type" />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                fullWidth
                options={tehsilOptions}
                value={values.tehsil_name}
                onChange={handleChange("tehsil_name")}
                renderInput={(params) => (
                  <TextField {...params} label="Tehsil" />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Code"
                value={values.code}
                onChange={handleChange("code")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Created At"
                value={values.createdAt}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditHospitalDialog;
