import { Alert, Box, Button, Card, Container, FormControl, FormLabel, Snackbar, Stack, styled, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import axios from 'axios';
import logo from './assets/logo.png';
import { useUser } from '../../context/UserContext';
import { jwtDecode } from 'jwt-decode';

const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  gap: theme.spacing(1),
  margin: 'auto',
  backgroundColor:'#FFF',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));


const Signin = () => {
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
      const [passwordError, setPasswordError] = React.useState(false);
      const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
      const [open, setOpen] = React.useState(false);
      const [formData, setFormData] = useState({ email: '', password: '' });
      const {token, setToken } = useAuth(); // Access setToken from AuthContext
      const navigate = useNavigate();
      const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
      const { user, setUser } = useUser();

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
      const handleSubmit = async(e) => {
          e.preventDefault();
          
          let isValid = true; 
        if (!formData.password || formData.password.length < 6) {
          setPasswordError(true);
          setPasswordErrorMessage('Password must be at least 6 characters long.');
          isValid = false;
        } else {
          setPasswordError(false);
          setPasswordErrorMessage('');
        }
        if (isValid) {
          try {
            const response = await axios.post(`${REACT_APP_API_URL}/api/users/login`, formData);
            if (response.status === 200) {
              sessionStorage.setItem('token', response.data.token);
              setToken(response.data.token); // Save token globally using context
              // Decode the token and set user data in UserContext
              const decodedUserData = jwtDecode(response.data.token); // Decode the JWT token
              setUser(decodedUserData); // Save user data in UserContext
              console.log('Login successful', response.data);
              setOpen(true);
              const redirectStep = sessionStorage.getItem('RedirectStep');
              if (redirectStep) {
                navigate(`/booking?step=${redirectStep}`);
                sessionStorage.removeItem('RedirectStep'); // Clear after redirect
              } else {
                navigate('/'); // Default redirection
              }
           
            }
        } catch (error) {
          console.error('Login error:', error);
          // Show error message based on the response from the server
          if (error.response) {
            if(error.response.data.message === 'User not found. Please check your registered mobile number.'){
              setMobileError(true); // You could show specific messages for email/password errors
              setMobileErrorMessage(error.response.data.message); 
            }
            else{
              setPasswordError(true); // You could show specific messages for email/password errors
              setPasswordErrorMessage(error.response.data.message); 
            }
          } else {
              setMobileError(true);
              setMobileErrorMessage('An unexpected error occurred. Please try again.');
          }         
         }
        }
          
      };
       
      

  return (
    <Box py={12} height={'100vh'} display='flex' flexDirection={'column'} alignItems='center' justifyContent='center'
    sx={{backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)"}}>
    <Box mb={5} mr={1}>
      <img src={logo} alt='trash-o-green' width={200}/>
    </Box>
    <Typography
        component="h1"
        variant="h4"
        fontFamily={"Merriweather , serif"}
        sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)' , fontWeight:'400'}}
        textAlign={'center'}
      >
        Welcome Back!
      </Typography>
      <Typography
      mt={0.5}
        component="h6"
        variant="body2"
        fontFamily={"Merriweather , serif"}
        sx={{ width: '100%', fontWeight:'300'}}
        mb={1}
        textAlign={'center'}
      >
        Sign in to your account to continue
      </Typography>
    <Container direction="column" justifyContent="center">
    <CardStyled variant="outlined">
      {/* <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)' }}
      >
        Sign in
      </Typography> */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <FormControl>
              <FormLabel htmlFor="mobile">Mobile No.</FormLabel>
              <TextField
                required
                fullWidth
                id="mobile"
                placeholder="0123456789"
                name="mobile"
                autoComplete="mobile"
                variant="outlined"
                error={mobileError}
                helperText={mobileErrorMessage}
                color={mobileError ? 'error' : 'primary'}
                value={formData.mobile}
                onChange={(e) => {
                  let value = e.target.value;
            
                  // Remove any non-numeric characters
                  value = value.replace(/[^0-9]/g, '');
            
                  // Update mobile number state
                  setFormData({ ...formData, mobile: value });
            
                  // Validate the mobile number on input change
                  if (value.length !== 10 || isNaN(value)) {
                    setMobileError(true);
                    setMobileErrorMessage('Mobile number must be exactly 10 digits long and contain only numbers.');
                  } else if (!/^[7-9]\d{9}$/.test(value)) {
                    setMobileError(true);
                    setMobileErrorMessage('Mobile number must start with 7, 8, or 9.');
                  } else {
                    setMobileError(false);
                    setMobileErrorMessage('');
                  }
                }}
              />
            </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
            value={formData.password} onChange={handleChange}
          />
        </FormControl>
        {/* <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        /> */}
        {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          Sign in
        </Button>
       <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px'}}>
        <Link
          component="button"
          type="button"
          // variant="body2"
          sx={{ alignSelf: 'center' }}
          style={{fontSize:'12px'}}
          to={'/forgotPassword'}
        >
          Forgot your password?
        </Link>
        <Typography sx={{fontSize:'12px'}}>
        Don't have an account?
        <Link
          component="button"
          type="button"
          // variant="body2"
          sx={{ alignSelf: 'center'}}
          style={{marginLeft:'5px', alignSelf:'center'}}
          to={'/signup'}
        >
           Register now
        </Link>
        </Typography>
       </Box>
      </Box>
      
    </CardStyled>
    <Snackbar open={open}  sx={{ zIndex: 9999 }}
     anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
        <Alert
          severity="success" color="success"
        >
          Logged in successfully!
        </Alert>
      </Snackbar>
  </Container>
    </Box>
  )
}

export default Signin