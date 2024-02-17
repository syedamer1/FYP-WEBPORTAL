/* eslint-disable react/prop-types */
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

const EditProvinceDialog = ({ open, onClose, initialData }) => {
  const [values, setValues] = useState({
    id: "",
    name: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (initialData) {
      setValues({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSave = () => {
    console.log("Updated values:", values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="edit-province-dialog"
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit Province</DialogTitle>
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Created At"
                value={values.createdAt}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Updated At"
                value={values.updatedAt}
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

export default EditProvinceDialog;
