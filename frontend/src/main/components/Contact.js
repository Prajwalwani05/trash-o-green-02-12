import { Box, Card, Container, Stack, styled, Typography } from '@mui/material'
import React from 'react'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import puneCity from './assets/punecity1.png';

const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  gap: theme.spacing(1),
  margin: 'auto',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  width: '100%',
  backgroundColor:'#E9F5E9',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const Contact = () => {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
       backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)"
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 18 },
          pb: { xs: 8, sm: 5 },
        }}
      > 
        <Stack
          spacing={2}
          useFlexGap
          mt={2}
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
        {/* <img src={img1} alt='about' width='180px'/> */}
          <Typography
          variant='h4'
            sx={{
              textAlign: 'center',
              color: '#414833',
              fontWeight: '400',
              fontFamily: 'serif',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >
            Get in touch with us.
          </Typography>
          <Box sx={{width:'100%', paddingLeft:'15px', display:'flex', flexDirection:'column', gap:'10px'}}>
          <Box>
          <Typography
            sx={{
              fontSize:'16px',
              textAlign: 'left',
              color: '#414833',
              fontWeight: '400',
              fontFamily: 'initial',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >Chat with us</Typography>
          <Typography
            sx={{
              fontSize:'12px',
              textAlign: 'left',
              color: 'grey',
              fontWeight: '100',
              fontStyle:'italic',
              fontFamily: 'initial',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >The support team is always available 24/7</Typography>
          </Box>
          <Box sx={{display:'flex', alignItems:'center', gap:'10px'}}>
            <WhatsAppIcon style={{color:'green'}}/>
            <a  href="https://wa.me/9561317701" rel='noreferrer' target="_blank">Chat on whatsapp</a>
          </Box>
          </Box>
          <Box sx={{width:'100%', paddingLeft:'15px', display:'flex', flexDirection:'column', gap:'10px'}}>
          <Box>
          <Typography
            sx={{
              fontSize:'16px',
              textAlign: 'left',
              color: '#414833',
              fontWeight: '400',
              fontFamily: 'initial',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >Send us an email</Typography>
          <Typography
            sx={{
              fontSize:'12px',
              textAlign: 'left',
              color: 'grey',
              fontWeight: '100',
              fontStyle:'italic',
              fontFamily: 'initial',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >Our team will respond promptly to your inquires</Typography>
          </Box>
          <Box>
          <Box sx={{display:'flex', alignItems:'center', gap:'10px'}}>
            <MailOutlineRoundedIcon style={{color:'crimson'}}/>
            <a href="mailto:support@trash-o-green.com">support@trash-o-green.com</a>
          </Box>
          <Box sx={{display:'flex', alignItems:'center', gap:'10px'}}>
            <MailOutlineRoundedIcon style={{color:'crimson'}}/>
            <a href="mailto:sale@trash-o-green.com">sale@trash-o-green.com</a>
          </Box>
          </Box>
          </Box>
          <Box sx={{width:'100%', paddingLeft:'15px', display:'flex', flexDirection:'column', gap:'10px'}}>
          <Box>
          <Typography
            sx={{
              fontSize:'16px',
              textAlign: 'left',
              color: '#414833',
              fontWeight: '400',
              fontFamily: 'initial',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >For more inquiry</Typography>
          <Typography
            sx={{
              fontSize:'12px',
              textAlign: 'left',
              color: 'grey',
              fontWeight: '100',
              fontStyle:'italic',
              fontFamily: 'initial',
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >Reach out for immediate assistance</Typography>
          </Box>
          <Box>
          <Box sx={{display:'flex', alignItems:'center', gap:'10px'}}>
            <CallRoundedIcon style={{color:'blue'}}/>
            <a href="tel:+919561317701">+91 9561317701</a>
          </Box>
          <Box sx={{display:'flex', alignItems:'center', gap:'10px'}}>
            <CallRoundedIcon style={{color:'blue'}}/>
            <a href="tel:+919096609945">+91 9096609945</a>
          </Box>
          </Box>
          </Box>
          <img src={puneCity} alt='punecityimage' width='230px'/>
          {/* <Typography
          variant='h3'
            sx={{
              textAlign: 'center',
              color: '#414833',
              fontWeight: '400',
              fontFamily: "Ephesis, cursive",
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >Clean Pune, Green Pune . </Typography> */}
        </Stack>
      </Container>
      {/* <ResponsiveGrid /> */}
    </Box>
  )
}

export default Contact