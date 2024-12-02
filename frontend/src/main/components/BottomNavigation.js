import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate, useLocation } from 'react-router-dom';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import MobileFriendlyRoundedIcon from '@mui/icons-material/MobileFriendlyRounded';
import HistoryToggleOffRoundedIcon from '@mui/icons-material/HistoryToggleOffRounded';
export default function FixedBottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname); // Initialize with the current path

  React.useEffect(() => {
    // Update value when the location changes
    setValue(location.pathname);
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ pb: 0,mt:6, backgroundColor: 'transparent' }}>
      <CssBaseline />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <BottomNavigationAction
            sx={{
              color: value === '/' ? '#3a5a40 !important' : 'grey',
              fontWeight:'normal'
            }}
            label="Home"
            value="/"
            icon={<HomeRoundedIcon style={{fontSize:'20px'}}/>}
            onClick={() => handleNavigation('/')}
          />
          <BottomNavigationAction
            sx={{
              color: value === '/booking' ? '#3a5a40 !important' : 'grey',
              fontWeight:'normal'
            }}
            label="Book"
            value="/booking"
            icon={<MobileFriendlyRoundedIcon style={{fontSize:'20px'}}/>}
            onClick={() => handleNavigation('/booking')}
          />
          <BottomNavigationAction
            sx={{
              color: value === '/myBooking' ? '#3a5a40 !important' : 'grey',
              fontWeight:'normal'
            }}
            label="Pickups" 
            value="/myBooking"
            icon={<LocalShippingRoundedIcon style={{fontSize:'20px'}}/>}
            onClick={() => handleNavigation('/myBooking')}
          />
          <BottomNavigationAction
            sx={{
              color: value === '/profile' ? '#3a5a40 !important' : 'grey',
              fontWeight:'normal'
            }}
            label="Profile"
            value="/profile"
            icon={ <AccountCircleRoundedIcon  style={{fontSize:'20px'}}/>}
            onClick={() => handleNavigation('/profile')}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
