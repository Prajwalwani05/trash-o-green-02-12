import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useNavigate} from 'react-router-dom';
import logo from './assets/logo.png';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { Typography } from '@mui/material';
import { TextOutdent } from '@phosphor-icons/react';
import { useUser } from '../../context/UserContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar({setActivePage}) {
  const [open, setOpen] = React.useState(false);
  const { token, logout } = useAuth();
  const { user, clearUser} = useUser();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSignOut = () => {
    logout(); // Clear token
    clearUser();
    navigate('/signin'); // Redirect to sign-in page
    toggleDrawer(false)(); // Close drawer
    console.log("user we are showing after logout ", user)
  };
  const handleSignUp = () => {
    logout(); // Clear token
    navigate('/signup'); // Redirect to sign-in page
    toggleDrawer(false)(); // Close drawer
  };
  
  const scrollToIdSection = (id) => {
    navigate(`/#${id}`);
    setTimeout(() => {
      const idElement = document.getElementById(id);
      if (idElement) {
        idElement.scrollIntoView({ behavior: 'smooth' });
        toggleDrawer(false)();
      }
    }, 500);
  };
  

  return (
    
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 15px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <img src={logo} width='120px' alt='logo' onClick={() => scrollToIdSection('hero')}/>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small" onClick={() => {navigate('/about') ; toggleDrawer(false)()}}>
              About Us
              </Button>
              <Button variant="text" color="info" size="small">
              Why Trash-O-Green
              </Button>
              <Button variant="text" color="info" size="small">
              What we do
              </Button>
              <Button variant="text" color="info" size="small">
              Mission
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={()=> scrollToIdSection('faq')}>
                FAQ
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={()=> scrollToIdSection('highlights')}>
                Hightlights
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => {navigate('/orders') ; toggleDrawer(false)()}}>
                My Orders
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => {navigate('/contact') ; toggleDrawer(false)()}}>
                Contact
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => {navigate('/profile') ; toggleDrawer(false)()}}>
                Profile
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {
              token === '' ?
            <Button color="primary" variant="outlined" size="small" onClick={() => {navigate('/signin') ; toggleDrawer(false)()}}
            fullWidth
            >
              Sign in
            </Button>
            :
            <Button
            fullWidth
             color="primary" variant="outlined" size="small" onClick={handleSignOut}>
              Sign out
            </Button>
            }

            <Button  color="primary" variant="contained" size="small" onClick={handleSignUp}
             fullWidth
             sx={{minWidth:'80px'}}
             >
              New User
            </Button>
            {/* <ColorModeIconDropdown /> */}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0 }}>
            {/* <ColorModeIconDropdown size="medium" /> */}
            <IconButton sx={{backgroundColor:'transparent', border:'none' }} aria-label="Menu button" onClick={toggleDrawer(true)}>
              {/* <MenuIcon style={{fontSize:'20px', color:'#2E5C21'}} /> */}
              <TextOutdent size={32} style={{color:'#2E5C21'}} />
            </IconButton>
            {/* <IconButton sx={{backgroundColor:'transparent', border:'none'}} aria-label="Menu button" onClick={() => navigate('/profile')} >
             <AccountCircleRoundedIcon style={{fontSize:'20px', color:'#2E5C21'}}/>
            </IconButton> */}
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                  borderRadius:'0px 0px 30px 30px'
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'green.background' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* <MenuItem>Home</MenuItem> */}
                <MenuItem onClick={() => {navigate('/about') ; toggleDrawer(false)()}}>About Us</MenuItem>
                <MenuItem>Why Trash-O-Green</MenuItem>
                <MenuItem>What we do</MenuItem>
                <MenuItem>Mission</MenuItem>
                <MenuItem onClick={() => scrollToIdSection('faq')}>FAQ</MenuItem>
                <MenuItem onClick={() => scrollToIdSection('highlights')}>Hightlights</MenuItem>
                <MenuItem onClick={() => {navigate('/orders') ; toggleDrawer(false)()}}>My Orders</MenuItem>
                <MenuItem onClick={() => {navigate('/contact') ; toggleDrawer(false)()}}>Contact</MenuItem>
                <MenuItem onClick={() => {navigate('/profile') ; toggleDrawer(false)()}}>Profile</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color='primary' size='small' variant="contained" className='buttons'  fullWidth onClick={handleSignUp}
                    sx={{ width: "100%",
                      fontFamily: '"Inria Sans", serif',
                      color: "#F2F7F2",
                      borderRadius: "10px",
                      backgroundColor: "#3a5a40",
                      border: "none",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", }}>
                    New User
                  </Button>
                  
                </MenuItem>
              
                <MenuItem>
                {
                  token === '' ? 
                  <Button color='primary' size='small' variant="outlined" fullWidth onClick={() => {navigate('/signin'); toggleDrawer(false)()}}>
                    Sign in
                  </Button>
                  :
                  <Button color='primary' size='small' variant="outlined" fullWidth onClick={handleSignOut}>
                    Sign out
                  </Button>
                }
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
