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
import logo from './assets/logoo.png';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook

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
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSignOut = () => {
    logout(); // Clear token
    navigate('/signin'); // Redirect to sign-in page
    toggleDrawer(false)(); // Close drawer
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
            <img src={logo} width='120px' alt='logo' />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button variant="text" color="info" size="small">
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
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                FAQ
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                Blog
              </Button>
              <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                Contact
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
            <Button color="primary" variant="text" size="small" onClick={() => {navigate('/signin') ; toggleDrawer(false)()}}>
              Sign in
            </Button>
            :
            <Button color="primary" variant="text" size="small" onClick={handleSignOut}>
              Sign out
            </Button>
            }

            <Button color="primary" variant="contained" size="small" onClick={() => {navigate('/signup'); toggleDrawer(false)()}}>
              New User
            </Button>
            {/* <ColorModeIconDropdown /> */}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0 }}>
            {/* <ColorModeIconDropdown size="medium" /> */}
            <IconButton sx={{backgroundColor:'transparent', border:'none' }} aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon style={{fontSize:'20px', color:'#2E5C21'}} />
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
                <MenuItem>About Us</MenuItem>
                <MenuItem>Why Trash-O-Green</MenuItem>
                <MenuItem>What we do</MenuItem>
                <MenuItem>Mission</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <MenuItem>Contact</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#F2F7F2', borderRadius:'30px', backgroundColor:'#3a5a40',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} variant="contained" fullWidth onClick={() => {navigate('/signup'); toggleDrawer(false)()}}>
                    New User
                  </Button>
                </MenuItem>
                <MenuItem>
                {
                  token === '' ? 
                  <Button sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#3a5a40', borderRadius:'30px',backgroundColor:'transparent',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} variant="outlined" fullWidth onClick={() => {navigate('/signin'); toggleDrawer(false)()}}>
                    Sign in
                  </Button>
                  :
                  <Button sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#3a5a40', borderRadius:'30px',backgroundColor:'transparent',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} variant="outlined" fullWidth onClick={handleSignOut}>
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
