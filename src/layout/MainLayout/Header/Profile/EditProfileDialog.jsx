import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Grid, // Import Grid
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

// eslint-disable-next-line react/prop-types
const EditProfileDialog = ({ open, onClose, initialData }) => {
  const [values, setValues] = useState({
    id: 123,
    usertype: "",
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    password: "",
    showPassword: false,
  });

  useEffect(() => {
    if (initialData) {
      setValues({ ...initialData });
    }
  }, [initialData]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSave = () => {
    console.log("Updated values:", values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="edit-profile-dialog"
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle variant="h3">Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-id"
                label="ID"
                value={values.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-usertype"
                label="User Type"
                value={values.usertype}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-firstname"
                label="First Name"
                sx={{}}
                value={values.first_name}
                onChange={handleChange("first_name")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-lastname"
                label="Last Name"
                padding="normal"
                value={values.last_name}
                onChange={handleChange("last_name")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-contact"
                label="Contact"
                value={values.contact}
                onChange={handleChange("contact")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-email"
                label="Email"
                value={values.email}
                onChange={handleChange("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <OutlinedInput
                fullWidth
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? (
                        <VisibilityOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
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

export default EditProfileDialog;
