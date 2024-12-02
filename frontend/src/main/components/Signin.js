import { Alert, Box, Button, Card, FormControl, FormLabel, Snackbar, Stack, styled, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MuiCard from '@mui/material/Card';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import axios from 'axios';

const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  gap: theme.spacing(1),
  margin: 'auto',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  }));
const Signin = () => {
      const [emailError, setEmailError] = React.useState(false);
      const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
      const [passwordError, setPasswordError] = React.useState(false);
      const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
      const [open, setOpen] = React.useState(false);
      const [formData, setFormData] = useState({ email: '', password: '' });
      const { setToken } = useAuth(); // Access setToken from AuthContext
      const navigate = useNavigate();

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
      const handleSubmit = async(e) => {
          e.preventDefault();
          
          let isValid = true; 
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          setEmailError(true);
          setEmailErrorMessage('Please enter a valid email address.');
          isValid = false;
        } else {
          setEmailError(false);
          setEmailErrorMessage('');
        }
    
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
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            // localStorage.setItem('token', response.data.token);
            if (response.status === 200) {
              setToken(response.data.token); // Save token globally using context
              console.log('Login successful', response.data);
              setOpen(true);
              setTimeout(() => {
                navigate('/')
              }, 500000000);
            }
        } catch (error) {
          console.error('Login error:', error);
          // Show error message based on the response from the server
          if (error.response) {
            if(error.response.data.message === 'User not found. Please check your registered email.'){
              setEmailError(true); // You could show specific messages for email/password errors
              setEmailErrorMessage(error.response.data.message); 
            }
            else{
              setPasswordError(true); // You could show specific messages for email/password errors
              setPasswordErrorMessage(error.response.data.message); 
            }
          } else {
              setEmailError(true);
              setEmailErrorMessage('An unexpected error occurred. Please try again.');
          }         
         }
        }
          
      };
     
  return (
    <SignInContainer  direction="column" justifyContent="center">
    <CardStyled variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)' }}
      >
        Sign in
      </Typography>
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
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            value={formData.email} onChange={handleChange}
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
            autoFocus
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
          sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#F2F7F2', borderRadius:'10px', backgroundColor:'#3a5a40',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}

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
          to={'#'}
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
  </SignInContainer>
  )
}

export default Signin