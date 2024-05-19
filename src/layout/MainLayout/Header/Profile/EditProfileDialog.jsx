import { useState, useEffect, forwardRef } from "react";
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
  Grid,
  Slide,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";
import PropTypes from "prop-types";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditProfileDialog = ({ open, onClose, user }) => {
  const [values, setValues] = useState({
    id: "",
    usertype: "",
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    password: "",
    cnic: "",
    province: null,
    division: null,
    district: null,
    tehsil: null,
    hospital: null,
  });

  useEffect(() => {
    if (user) {
      setValues({ ...user });
    }
  }, [user]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues((prevValues) => ({
      ...prevValues,
      showPassword: !prevValues.showPassword,
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSave = async () => {
    const payload = {
      ...values,
      tehsil: values.usertype === "Tehsil Administrator" ? values.tehsil : null,
      division:
        values.usertype === "Division Administrator" ? values.division : null,
      district:
        values.usertype === "District Administrator" ? values.district : null,
      province:
        values.usertype === "Province Administrator" ? values.province : null,
      hospital:
        values.usertype === "Hospital Administrator" ? values.hospital : null,
    };

    try {
      await axios.put("http://localhost:8080/user/update", payload);
      onClose();
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-describedby="edit-profile-dialog"
      PaperProps={{
        style: {
          borderRadius: "12px",
          padding: "4px",
        },
      }}
      TransitionComponent={Transition}
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
                id="outlined-required-cnic"
                label="CNIC"
                value={values.cnic}
                onChange={handleChange("cnic")}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-firstname"
                label="First Name"
                value={values.firstName}
                onChange={handleChange("firstName")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="outlined-required-lastname"
                label="Last Name"
                value={values.lastName}
                onChange={handleChange("lastName")}
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

            <Grid item xs={6}>
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

EditProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
