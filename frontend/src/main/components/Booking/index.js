import { Box, Button, FormControl, FormLabel, TextField, Typography, Select, MenuItem, Stack, Card, styled, Autocomplete, Chip } from '@mui/material';
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use the named import
import TransitionsModal from './Modal';

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

const BookingContainer = styled(Stack)(({ theme }) => ({
  // height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const Booking = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    area: '',
    address: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [mobileError, setMobileError] = React.useState(false);
  const [mobileErrorMessage, setMobileErrorMessage] = React.useState('');
  const [trashtype, settrashtype] = useState([]);

  const options = ['E-Waste - Rs.10 /Kg', 'Plastic - Rs.10 /kg', 'Newspaper - Rs.17 /kg', 'Iron - Rs.25 /kg', 'Cardboard - Rs.6 /kg', 'Aluminium - Rs.100 /kg', 'Steel - Rs.35 /kg',  'Motor - Rs.30 /kg', 'Battery - Rs.55 /kg', 'Copper - Rs.400 /kg', 'Insulated wire - Rs.40 /kg', 'Refrigerator - Rs.600 /pc', 'Air-Conditioner - Rs.2500 /pc', 'Washing-Machine - Rs.500 /pc', 'LCD/LED TV - Rs.100 /pc', 'CPU - Rs.150 /pc', 'Toys - Rs.2 /kg', 'Bottles - Rs.0 /pc'];
  const handleAutocompleteChange = (event, value) => {
    settrashtype(value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to make a booking.');
      return;
  }
  // Decode the token and check if it is expired
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decoded.exp < currentTime) {
      // Token is expired
      setError('Session expired. Please log in again.');
      localStorage.removeItem('token'); // Remove the expired token
      setTimeout(() => {
        window.location.href = '/signin'; // Redirect to the sign-in page
      }, 1000);
      return;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    setError('An error occurred. Please try again later.');
    return;
  }
    try {
      const response = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`  },
        body: JSON.stringify({...formData, trashtype}),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
        console.log('Form submission successful!');
         // Reset form data using setFormData
        setFormData({
          mobile: '',
          area: '',
          address: ''
        });
        // If trashtype is a separate state, reset it as well
        settrashtype([]);  // Assuming trashtype is stored in selectedOptions
      }
        else {
          console.error('Failed to submit request:', result.message);
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // if (submitted) {
  //   return <TransitionsModal />;
  // }

  return (
    <BookingContainer direction="column" justifyContent="center">
      <CardStyled variant="outlined">
        <Typography component="h1" variant="h4" sx={{ width: '100%' }}>
          Book Trash Pickup
        </Typography>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} method="POST">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
          <FormLabel htmlFor="TrashType">Trash Type</FormLabel>
          {/* Container to display the selected tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginBottom: 0.8 }}>
            {trashtype.map((option, index) => (
              <Chip
                sx={{backgroundColor:'#c7f9cc'}}
                key={option}
                label={option}
                onDelete={() => {
                  // Handle deletion of a tag
                  const updatedOptions = trashtype.filter((_, i) => i !== index);
                  settrashtype(updatedOptions);
                }}
              />
            ))}
          </Box>
          <Autocomplete
              multiple
              id="tags-select"
              size='small'
              options={options}
              value={trashtype}
              onChange={handleAutocompleteChange}
              renderTags={() => null}
              renderInput={(params) => (
                <TextField {...params} variant="outlined"  placeholder="Select..." sx={{
                  '.MuiOutlinedInput-root': {
                  },
                  '.MuiInputLabel-root': {
                    top: '-5px', // Adjust label position
                  },
                  
                  '.MuiAutocomplete-endAdornment .MuiIconButton-root': {
                   width:'1.8rem',
                   height:'1.8rem'
                  },
                }}/>
              )}
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
              <FormLabel htmlFor="area">Service Area</FormLabel>
              <Select
                required
                fullWidth
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
              >
                <MenuItem value="" selected>Select Area</MenuItem>
                <MenuItem value="KOTHRUD">Kothrud</MenuItem>
                <MenuItem value="KARVE NAGAR">Karve Nagar</MenuItem>
                <MenuItem value="WARJE">Warje</MenuItem>
                <MenuItem value="SHIVANE">Shivane</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                required
                fullWidth
                name="address"
                placeholder="Enter your address"
                type="text"
                id="address"
                variant="outlined"
                color="primary"
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              className='buttons'
              variant="contained"
              // sx={{ backgroundColor: '#76B664', color: '#fff', borderRadius: '10px' }}
            >
              Book
            </Button>
          </Box>
        </form>
        {submitted && <TransitionsModal />}
      </CardStyled>
    </BookingContainer>
  );
};

export default Booking;
