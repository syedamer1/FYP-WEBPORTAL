import { useState, useEffect, useCallback } from "react";
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

const AddDistrictDialog = ({ open, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    division: null,
  });
  const [divisionOptions, setDivisionOptions] = useState([
    { id: "", name: "" },
  ]);

  useEffect(() => {
    const fetchDivisionOptions = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_BASEURL + "/division/getIdAndName"
        );
        setDivisionOptions(response.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisionOptions();
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleDivisionChange = (event, newValue) => {
    if (!newValue) {
      setFormData((prevData) => ({
        ...prevData,
        division: { id: "", name: "" },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        division: newValue,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_REACT_APP_BASEURL + "/district/add",
        formData
      );
      setFormData({
        name: "",
        division: { id: "", name: "" },
      });
      refresh();
      onClose();
    } catch (error) {
      console.error("Error creating district:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Add District</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
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
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="division-autocomplete"
                  value={formData.division}
                  onChange={handleDivisionChange}
                  options={divisionOptions}
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Division"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
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

AddDistrictDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddDistrictDialog;
