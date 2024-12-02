import { Box, Button, Card, CircularProgress, FormControl, FormLabel, Stack, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MuiCard from '@mui/material/Card';
import profilepic from './assets/profile_pic.jpg';
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

const ProfileContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  }));
const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
  const [user, setUser] = useState({
        name: '',
        email: '',
        mobile: '',
      });

      useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setUser(data); // Assuming setUserProfile is a state setter
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
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
      if(isValid){
        try {
            const response = await fetch('http://localhost:5000/api/users/updateUser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(user), // Collect data from form inputs
            });
            const result = await response.json();
            if (response.ok) {
              setSuccess(true);
              setTimeout(() => setSuccess(false), 5000); 
            } else {
                console.error('Error updating profile:', result.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
      }
      setTimeout(() => {
        setLoading(false); // End loading state
      }, 2000);
  };
   
  return (
    <ProfileContainer  direction="column" justifyContent="center">
    <CardStyled variant="outlined">
      <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(1rem, 5vw, 1. 5rem)' }}
      >
        User Profile
      </Typography>
      <Box sx={{borderRadius:'50%', boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", padding:'9px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <img src={profilepic} alt='user-profile' width='45px' />
      </Box>
      </Box>
      <Box
        component="form"
        onSubmit={handleUpdateProfile}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#F2F7F2', borderRadius:'10px', backgroundColor:'#3a5a40',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
          disabled={loading}
        >
        {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : success ? (
                      'Updated!'
                    ) : (
                      'Update Profile'
                    )}
        </Button>
      </Box>
      
    </CardStyled>
  </ProfileContainer>
  )
}

export default Profile;