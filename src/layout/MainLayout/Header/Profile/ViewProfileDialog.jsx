import avataruser from "@assets/images/users/avatar-1.png";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const ViewProfileDialog = ({ open, onClose, profiledata }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle variant="h3">View Profile</DialogTitle>

      <DialogContent>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Avatar
              alt="profile user"
              src={avataruser}
              style={{ width: 120, height: 120, marginBottom: "20px" }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <AccountCircleIcon style={{ marginRight: "10px" }} />
            <div>
              <Typography variant="h5">Full Name</Typography>
              <Typography variant="body1">
                {profiledata.first_name} {profiledata.last_name}
              </Typography>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <BadgeIcon style={{ marginRight: "10px" }} />
            <div>
              <Typography variant="h5">User ID</Typography>
              <Typography variant="body1">{profiledata.id}</Typography>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <EmailIcon style={{ marginRight: "10px" }} />
            <div>
              <Typography variant="h5">Email</Typography>
              <Typography variant="body1">{profiledata.email}</Typography>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <PhoneIcon style={{ marginRight: "10px" }} />
            <div>
              <Typography variant="h5">Contact</Typography>
              <Typography variant="body1">{profiledata.contact}</Typography>
            </div>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: "flex", alignItems: "center" }}
          >
            <EventIcon style={{ marginRight: "10px" }} />
            <div>
              <Typography variant="h5">Created At</Typography>
              <Typography variant="body1">{profiledata.created_at}</Typography>
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewProfileDialog;

ViewProfileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profiledata: PropTypes.object.isRequired,
};
