// Profile.js
import { Box, Button, Card, CircularProgress, Container, FormControl, FormLabel, Stack, styled, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext'; // import the useUser hook
import logo from './assets/logo.png';
import { jwtDecode } from 'jwt-decode';

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

const Profile = () => {
  const [ user, setUser ] = useState([]); // get user data and setUser function from context
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');

  useEffect(() => {
      const fetchUserData = async () => {
        const token = sessionStorage.getItem("token");
        if (token) {
          try {
            const response = await fetch('/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUser(data);
            console.log(user);
            
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      };
      fetchUserData();
    }, []);
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    let isValid = true;

    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!user.mobile || user.mobile.length !== 10 || isNaN(user.mobile)) {
      setMobileError(true);
      setMobileErrorMessage('Mobile number must be exactly 10 digits long and contain only numbers.');
      isValid = false;
    } else {
      setMobileError(false);
      setMobileErrorMessage('');
    }

    if (!user.name || user.name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (isValid) {
      try {
        const response = await fetch('http://localhost:5000/api/users/updateUser', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify(user),
        });
        const result = await response.json();
        if (response.ok) {
          setSuccess(true);
          setUser(result.user); // update user data after successful update
          setTimeout(() => setSuccess(false), 5000);
        } else {
          console.error('Error updating profile:', result.message);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Box py={12} height={'100vh'} display="flex" flexDirection={'column'} alignItems="center" justifyContent="center"
    sx={{backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)"}}>
            <Box mb={5}>
                      <img src={logo} alt='trash-o-green' width={200}/>
                    </Box>
            <Typography  component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)', fontWeight:'400' }}
            fontFamily={"Merriweather , serif"}
            mb={1}
            textAlign={'center'}>
              My Profile
            </Typography>
      <Container direction="column" justifyContent="center">
        <CardStyled variant="outlined">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          </Box>
          <Box component="form" onSubmit={handleUpdateProfile} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <TextField
                error={nameError}
                helperText={nameErrorMessage}
                id="name"
                type="name"
                name="name"
                placeholder="Jon Snow"
                autoComplete="name"
                required
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                fullWidth
                variant="outlined"
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="mobile">Mobile No.</FormLabel>
              <TextField
                error={mobileError}
                helperText={mobileErrorMessage}
                id="mobile"
                type="mobile"
                name="mobile"
                placeholder="0123456789"
                autoComplete="mobile"
                required
                value={user.mobile}
                onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                fullWidth
                variant="outlined"
                color={mobileError ? 'error' : 'primary'}
              />
            </FormControl>
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
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="area">Area</FormLabel>
              <TextField
                id="area"
                type="area"
                name="area"
                placeholder="XYZ"
                autoComplete="area"
                required
                value={user.area}
                onChange={(e) => setUser({ ...user, area: e.target.value })}
                fullWidth
                variant="outlined"
                color="primary"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                id="address"
                type="address"
                name="address"
                placeholder="XYZ"
                autoComplete="address"
                required
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                fullWidth
                variant="outlined"
                color="primary"
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : success ? 'Updated!' : 'Update Profile'}
            </Button>
          </Box>
        </CardStyled>
      </Container>
    </Box>
  );
};

export default Profile;
