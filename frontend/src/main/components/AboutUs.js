import { Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import img1 from './assets/inAbout.png'
const AboutUs = () => {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
      
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 2, sm: 18 },
          pb: { xs: 8, sm: 5 },
        }}
      > 
        <Stack
          spacing={2}
          useFlexGap
          mt={2}
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
        <img src={img1} alt='about' width='180px'/>
          <Typography
          variant='h4'
            sx={{
              textAlign: 'center',
              color: '#414833',
              fontWeight: '400',
              fontFamily: "Ephesis, cursive",
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >
            Think Recycling, <br /> Think Trash-O-Green
          </Typography>
     
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: 'center', fontSize:'15px' , fontFamily: "Charm, cursive"}}
          >
            We at Trash-O-Green, Pune's first and only   online trash collection company are committed to provide doorstep and time convenient service to our customers. We recycle trash and aim Zero Waste Initiative. It is Green Movement initiated by engineers as a responsibility to towards Society and towards a Planet. We are aiming towards sustainable living & zero carbon footprint.

          </Typography>
          <Typography
          variant='h3'
            sx={{
              textAlign: 'center',
              color: '#414833',
              fontWeight: '400',
              fontFamily: "Ephesis, cursive",
              width: { sm: '100%', md: '80%' },
            }}
            // mt={2}
          >Clean Pune, Green Pune . </Typography>
        </Stack>
      </Container>
      {/* <ResponsiveGrid /> */}
    </Box>
  )
}

export default AboutUs