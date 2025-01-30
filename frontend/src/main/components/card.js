import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ecoImage from './assets/coins.png'; // Replace with your image path
import { useNavigate } from 'react-router-dom';

export default function GreenCoinCard({tokenFlag}) {
    const navigate = useNavigate();
    const handleClick = () =>{
        navigate('/booking')
    }
    const handleCoinsPage = () => {
      navigate('/mycoins')
    }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.75)', // Soft green background
        borderRadius: '0px',
        boxShadow:' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
        p: 3,
        mt: 1,
        textAlign: 'center',
        mx: 3,
      }}
    >
      <img 
      onClick={handleCoinsPage}
        src={ecoImage} 
        alt="Eco Green" 
        style={{ width: '100px', height: '100px', marginBottom: '10px' }} 
      />
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3A5A40' }}>
        Earn Green Coins from Trash!
      </Typography>
      <Typography sx={{ color: '#4F4F4F', fontSize: '16px', lineHeight: 1.5 }}>
        Collect green coins by recycling your trash and redeem them for amazing 
        discounts on eco-friendly products.
      </Typography>
      {
        tokenFlag ?
      <Button
      onClick={handleClick}
        variant="contained"
        sx={{ width: "100%",
          fontFamily: '"Inria Sans", serif',
          color: "#F2F7F2",
          borderRadius: "10px",
          backgroundColor: "#3a5a40",
          border: "none",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", }}
      >
        Start Earning Now
      </Button>
      :
      <Box></Box>
      }
    </Box>
  );
}
