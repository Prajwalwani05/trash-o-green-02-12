import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import 'animate.css';
import wallet from './assets/wallet-removebg-preview.png';
import eco from './assets/3421435-removebg-preview.png';
import trust from './assets/5740250-removebg-preview.png';
import rest from './assets/8962092-removebg-preview.png';

const SpeechBubble = styled(Card)(({ alignRight }) => ({
  position: 'relative',
  backgroundColor: 'transparent',
  borderRadius: alignRight ? '50px 50px 50px 0' : '50px 50px 0 50px',
  padding: '12px',
  maxWidth: '300px',
  textAlign: 'center',
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  marginBottom: '20px',
 
}));

const SpeechBubbleContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
});

const SpeechBubbleComponent = () => {
  return (
    <Box p={2}>
        <Box display="flex" justifyContent="flex-start" mt={0}>
        <SpeechBubble className="animate__animated animate__bounceIn custom-delay-1-8s">
          <SpeechBubbleContent>
            {/* <Typography variant="h5" component="span" style={{ fontSize: '24px' }}>
              ★
            </Typography> */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6">Best Rates</Typography>
              <Typography variant="body2">
                We provide the best value for your scrap from our network of Recyclers.
              </Typography>
              <Box width={120} mt={0.5}>
              <img src={wallet} alt='img' width='100%'/>
              </Box>
            </Box>
          </SpeechBubbleContent>
        </SpeechBubble>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <SpeechBubble className="animate__animated animate__bounceIn custom-delay-2-4s" alignRight>
          <SpeechBubbleContent>
            {/* <Typography variant="h5" component="span" style={{ fontSize: '24px' }}>
              ★
            </Typography> */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6">Convenience</Typography>
              <Typography variant="body2">
              Doorstep pickup according to user's convenient date & time.
              </Typography>
              <Box width={120} mt={0.5}>
              <img src={rest} alt='img' width='100%'/>
              </Box>
            </Box>
          </SpeechBubbleContent>
        </SpeechBubble>
      </Box>
      <Box display="flex" justifyContent="flex-start" mt={0}>
        <SpeechBubble className="animate__animated animate__bounceIn custom-delay-2-8s">
          <SpeechBubbleContent>
            {/* <Typography variant="h5" component="span" style={{ fontSize: '24px' }}>
              ★
            </Typography> */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6">Trust</Typography>
              <Typography variant="body2">
              Trained & Verified Pickup Staff with Smart Weighing Scale.
              </Typography>
              <Box width={120} mt={0.5}>
              <img src={trust} alt='img' width='100%'/>
              </Box>
            </Box>
          </SpeechBubbleContent>
        </SpeechBubble>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <SpeechBubble className="animate__animated animate__bounceIn animate__delay-3s" alignRight sx={{marginBottom:'0'}}>
          <SpeechBubbleContent>
            {/* <Typography variant="h5" component="span" style={{ fontSize: '24px' }}>
              ★
            </Typography> */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6">Eco-friendly</Typography>
              <Typography variant="body2">
              We ensure responsible recycling of your scrap items.
              </Typography>
              <Box width={120} mt={0.5}>
              <img src={eco} alt='img' width='100%'/>
              </Box>
            </Box>
          </SpeechBubbleContent>
        </SpeechBubble>
      </Box>
    </Box>
  );
};

export default SpeechBubbleComponent;
