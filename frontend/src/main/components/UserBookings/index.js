import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Card, Divider, Stack, styled, Typography } from '@mui/material';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import OfflinePinRoundedIcon from '@mui/icons-material/OfflinePinRounded';
import { useNavigate } from 'react-router-dom';
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
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
  }));

  
const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/api/bookings/all', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Check if data is returned
                    if (response.data && response.data.length > 0) {
                        setBookings(response.data);
                    } else {
                        setError('No bookings found');
                    }

                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                    setError('Failed to fetch bookings');
                    setLoading(false);
                }
            } else {
                setError('Please log in to view your bookings');
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

  return (
    <BookingContainer direction="column" justifyContent="center">
    <CardStyled variant="outlined">
      <Typography component="h1" variant="h4" sx={{ width: '100%' }}>
        My Bookings
      </Typography>
        {loading ? (
            <p>Loading bookings...</p>
        ) : error ? (
        error === 'No bookings found' ? 
            <Box pt={2} sx={{display:'flex', flexDirection:'column', gap:'5px', alignItems:'center'}}>
                <Typography>No bookings found!!</Typography>
                <Button
            fullWidth
            variant="contained"
            className='buttons'
            onClick={()=> navigate('/booking')}
            >Click and book now</Button> 
            </Box>
            : <p>No bookings found!!</p>
        ) : (
            <Box mt={2} sx={{display:'flex', flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', gap:'10px'}}>
                {bookings.map((booking, index) => (
                    
                        <Box key={index} sx={{padding:'5px 0', width:'100%' , fontFamily:'Nunito Sans, sans-serif'}}>
                            <Box sx={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:'10px', color:'#38b000'}}>
                           <Typography>
                            {new Date(booking.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',   // "02"
                                month: '2-digit', // "12"
                                year: '2-digit',  // "24"
                            })}
                            </Typography>
                            <Divider orientation='vertical' flexItem/>
                            <Typography>
                            {new Date(booking.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',     // Ensures two-digit hour (e.g., "08")
                                minute: '2-digit',   // Ensures two-digit minute (e.g., "15")
                                hour12: true,        // Ensures 12-hour format with AM/PM
                            }).replace(':', '.')}  
                            </Typography>

                            </Box>
                            <Typography sx={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                Booking Status: {booking.status === 'pending' ? <Typography sx={{display:'flex', alignItems:'center'}}> <AccessTimeFilledRoundedIcon  style={{color:'#eeba0b', fontSize:'20px'}}/> Pending</Typography> : <Typography sx={{display:'flex', alignItems:'center'}}> <OfflinePinRoundedIcon style={{color:'green', fontSize:'20px'}} /> Completed</Typography>}
                            </Typography>
                            <Divider/>
                            {/* <Typography>
                                Area: {booking.area}
                            </Typography>
                            <Typography>
                                Address: {booking.address}
                            </Typography> */}
                        </Box>
                        // {/* <li key={index}>{booking.area} - {booking.address} - {booking.name} - {booking.mobile}</li> */}
                ))}
            </Box>
        )}
        </CardStyled>
    </BookingContainer>
  );
}

export default UserBookings;
