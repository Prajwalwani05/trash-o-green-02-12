import { Box, Typography } from '@mui/material';
import React from 'react';
import truck from './assets/a5j14ARDgu.gif'; // Ensure this is a gif file
import logo from './assets/logo.png'; // Ensure this is a gif file

const Loader = () => {
  return (
    <Box sx={{
      padding:0,
      width: '100%', 
      height: '50vh', 
      position: 'fixed', 
      backgroundColor: '#FFF', 
      display: 'flex', 
      flexDirection:'column',
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <img src={truck} alt='loading...' width='80px'/>
    </Box>
  );
}

export default Loader;
