import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Avatar,
  Button,
  Slide,
} from "@mui/material";
import {
  AccessTime as AccessTimeIcon,
  SupervisorAccount as SupervisorAccountIcon,
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

import avataruser from "@assets/images/users/avatar-1.png";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewProfileDialog = ({ open, onClose, profiledata }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="xs"
      PaperProps={{
        style: {
          borderRadius: "12px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle
        variant="h3"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#000",
        }}
      >
        User Profile
      </DialogTitle>

      <DialogContent dividers>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={2}
          style={{ marginBottom: "20px" }}
        >
          <Grid item xs={12}>
            <Avatar
              alt="profile user"
              src={avataruser}
              sx={{
                width: 140,
                height: 140,
                margin: "0 auto",
                border: "2px solid #1677ff",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<AccountCircleIcon />}
              label="Name"
              value={`${profiledata.firstName} ${profiledata.lastName}`}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<BadgeIcon />}
              label="Cnic"
              value={profiledata.cnic}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<EmailIcon />}
              label="Email"
              value={profiledata.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<PhoneIcon />}
              label="Contact"
              value={profiledata.contact}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<AccessTimeIcon />}
              label="User Since:"
              value={profiledata.createdOn}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<SupervisorAccountIcon />}
              label="User Type"
              value={profiledata.usertype}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          style={{
            borderRadius: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
    {icon &&
      React.cloneElement(icon, {
        style: { marginRight: "10px", color: "#1677ff" },
      })}
    <div>
      <Typography
        variant="subtitle1"
        gutterBottom
        style={{ color: "#000", fontWeight: "bold" }}
      >
        {label}
      </Typography>
      <Typography variant="body2" style={{ color: "#000" }}>
        {value}
      </Typography>
    </div>
  </div>
);

ViewProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profiledata: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    id: PropTypes.string,
    email: PropTypes.string,
    contact: PropTypes.string,
    createdOn: PropTypes.string,
    cnic: PropTypes.string,

    usertype: PropTypes.string,
  }).isRequired,
};

InfoItem.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default ViewProfileDialog;
