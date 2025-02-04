import { Alert, Box, Button, Card, Container, FormControl, FormLabel, styled, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import logo from './assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../../context/UserContext';


const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  gap: theme.spacing(1),
  margin: 'auto',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  width: '100%',
  backgroundColor:'#FFF',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const Signup = () => {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [mobileError, setMobileError] = React.useState(false);
    const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
          const {token, setToken } = useAuth(); // Access setToken from AuthContext
                const { user, setUser } = useUser();
          
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      mobile: '',
      password: '',
  });
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);  // State for the success alert
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
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
      if (!formData.mobile || formData.mobile.length !== 10 || isNaN(formData.mobile)) {
        setMobileError(true);
        setMobileErrorMessage('Mobile number must be exactly 10 digits long and contain only numbers.');
        isValid = false;
      } else {
        setMobileError(false);
        setMobileErrorMessage('');
      }
      // if(!formData.role){
      //   setPasswordError(true);
      //   setPasswordErrorMessage('Role is not define')
      // }
      // else{
      //   setPasswordError(false);
      //   setPasswordErrorMessage('');
      // }
      if (!formData.password || formData.password.length < 6) {
        setPasswordError(true);
        setPasswordErrorMessage('Password must be at least 6 characters long.');
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }

      if (formData.mobile.length > 10) {
        setMobileError(true);
        setMobileErrorMessage('Mobile number length should be 10.');
        isValid = false;
      } else {
        setMobileError(false);
        setMobileErrorMessage('');
      }
  
      if (!formData.name || formData.name.length < 1) {
        setNameError(true);
        setNameErrorMessage('Name is required.');
        isValid = false;
      } else {
        setNameError(false);
        setNameErrorMessage('');
      }
  
      if (isValid) {
        try {
          const response = await axios.post(`${REACT_APP_API_URL}/api/users/register`, formData);
          console.log('Signup successful:', response.data);
         if (response.status === 200) {
                     sessionStorage.setItem('token', response.data.token);
                     setToken(response.data.token); // Save token globally using context
                     // Decode the token and set user data in UserContext
                     const decodedUserData = jwtDecode(response.data.token); // Decode the JWT token
                     setUser(decodedUserData); // Save user data in UserContext
                     console.log('successful', response.data);
                    //  setOpen(true);
                     const redirectStep = sessionStorage.getItem('RedirectStep');
                     if (redirectStep)   {
                       navigate(`/booking?step=${redirectStep}`);
                       sessionStorage.removeItem('RedirectStep'); // Clear after redirect
                     } else {
                       navigate('/'); // Default redirection
                     }
                  
                   }
          //   // Trigger success alert and navigate to sign-in
        // setShowAlert(true);
        // setTimeout(() => {
        //   setShowAlert(false);
        //   navigate('/');
        // }, 3000); // Alert will be visible for 3 seconds
        } catch (error) {
          console.error('Signup error:', error);
          console.log(formData)
        }
      }
      
    };
  return (
  <Box py={12} height={'100vh'} display='flex' flexDirection={'column'} alignItems='center' justifyContent='center'
  sx={{backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)"}}
  >
    <Box mb={5} mr={1}>
          <img src={logo} alt='trash-o-green' width={200}/>
        </Box>
        <Typography
                component="h1"
                variant="h4"
                fontFamily={"Merriweather , serif"}
                sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)', fontWeight:'400'}}
                textAlign={'center'}
              >
                Let's Get Started!
              </Typography>
              <Typography
              mt={0.5}
                component="h6"
                variant="body2"
                sx={{ width: '100%', fontWeight:'300'}}
                mb={1}
                fontFamily={"Merriweather , serif"}
                textAlign={'center'}
              >
                Create an account to get started
              </Typography>
  <Container  direction="column" justifyContent="center">
        <CardStyled variant="outlined">
          {/* <SitemarkIcon /> */}
         
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
             {/* <FormControl>
                        <FormLabel htmlFor="role">Role</FormLabel>
                        <Select
                            required
                            fullWidth
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl> */}
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
                value={formData.name} onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? 'error' : 'primary'}
                value={formData.email} onChange={handleChange}
              />
            </FormControl>
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
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
                value={formData.password} onChange={handleChange}
              />
            </FormControl>
          
            <Button
              type="submit"
              fullWidth
              variant="contained"
              // onClick={validateInputs}
              // sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#F2F7F2', borderRadius:'10px', backgroundColor:'#3a5a40',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
            >
              Sign up
            </Button>
            <Typography style={{fontSize:'12px', textAlign:'center'}}>
            Already have an account?
            <Link
                component="button"
                type="button"
                variant="body2"
                to={'/signin'}
                style={{marginLeft:'5px'}}
              >Signin now</Link>
            </Typography>
          </Box>
        </CardStyled>
        {showAlert && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Signup successful !!
        </Alert>
      )}
      </Container>
  </Box>
  )
}

export default Signup;