import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function Hero() {
  const navigate = useNavigate();
  
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundColor:'transparent',
        backgroundImage:
        'none',
      ...theme.applyStyles('dark', {
        backgroundImage:
          'none',
      }),
      
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height:'100%',
          pt: { xs: 12, sm: 18 },
          pb: { xs: 2, sm: 5 },
        }}
      >
        
        <Box
          id="image"
          sx={(theme) => ({
            // mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 180, sm: 700 },
            width: '100%',
            backgroundImage:
              theme.palette.mode === 'light'
                ? 'url("https://i.postimg.cc/mkpYfLWv/Screenshot-2024-11-12-192759-removebg.png")'
                : 'url("https://i.postimg.cc/mkpYfLWv/Screenshot-2024-11-12-192759-removebg.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            borderRadius: '10px',
            
          })}
        />
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
        
          <Typography
            sx={{
              textAlign: 'center',
              color: '#414833',
              fontWeight: 'bold',
              fontFamily:'"Inria Sans", serif',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >
            Doorstep, Online Trash Collection Service in Pune
          </Typography>
          <Box display='flex' alignItems='center'>
          <Typography sx={{color: '#706F6B',
              fontWeight: 'bold',
              fontFamily:'"Inria Sans", serif',}}>For Households</Typography>
          <Divider
                orientation="vertical"
                flexItem // Ensures the Divider stretches to match the Box height
                sx={{ mx: 2 }} // Adds spacing around the Divider
            />
          <Typography sx={{color: '#706F6B',
              fontWeight: 'bold',
              fontFamily:'"Inria Sans", serif',}}>For Business</Typography>
          </Box>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 0, width: { xs: '100%', sm: '350px' } }}
          >
            <Button
              variant="contained"
            //   color="primary"
              size="small"
              sx={{ minWidth: 'fit-content',fontFamily:'"Inria Sans", serif',color:'#F2F7F2', borderRadius:'30px', backgroundColor:'#3a5a40',  backgroundImage:'none', border:'none', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
              onClick={()=> navigate('/booking')}
            >
              Book Request
            </Button>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Got junk? We'll handle the mess, so you can stress less!
          </Typography>
         
          {/* <PlaceIcon/> */}
        </Stack>
      </Container>
      {/* <MyCarousel  /> */}
    </Box>
  );
}
