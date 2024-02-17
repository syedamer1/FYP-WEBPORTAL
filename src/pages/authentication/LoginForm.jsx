import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Form = () => {
  const [userEmail, setUserEmail] = useState('example@example.com');
  const [userPassword, setUserPassword] = useState('password123');
  const [isChecked, setIsChecked] = useState(false);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isEmailValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === 'email') {
      setUserEmail(value);
    } else if (name === 'password') {
      setUserPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      setLoginError(null);
      setTimeout(() => {
        navigate('/dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setLoginError(err.message);
    }
  };

  const toggleShowPassword = () => {
    setShowUserPassword(!showUserPassword);
  };

  const preventMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="user-email">Email Address</InputLabel>
              <OutlinedInput
                id="user-email"
                type="email"
                value={userEmail}
                name="email"
                onChange={handleInputChange}
                placeholder="Enter email address"
                fullWidth
                error={Boolean(userEmail && !isEmailValid(userEmail))}
              />
              {userEmail && !isEmailValid(userEmail) && (
                <FormHelperText error>Your email is not valid</FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="user-password">Password</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(userPassword && !isPasswordValid(userPassword))}
                id="user-password"
                type={showUserPassword ? 'text' : 'password'}
                value={userPassword}
                name="password"
                onChange={handleInputChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      onMouseDown={preventMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showUserPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Enter password"
              />
              {userPassword && !isPasswordValid(userPassword) && (
                <FormHelperText error>Your password is not valid</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sx={{ mt: -1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(event) => setIsChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="h6">Keep me signed in</Typography>}
              />
              <Link variant="h6" component={RouterLink} to="" color="text.primary">
                Forgot Password?
              </Link>
            </Stack>
          </Grid>
          {loginError && (
            <Grid item xs={12}>
              <FormHelperText error>{loginError}</FormHelperText>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default Form;
