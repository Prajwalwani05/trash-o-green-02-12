import { Box, styled, Typography } from '@mui/material'
import React from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import {motion} from 'framer-motion'
import placed from '../assets/confirm.gif';
import { useUser } from '../../../context/UserContext';

const StyledBox = styled(Box)({
    position: 'relative',
    backgroundColor: 'transparent',
    padding:'20px',
    borderRadius:'50%',
    '&:after': {
      position: 'absolute',
      content: '""',
      width:'50%',
      height:'100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
      margin: 'auto',
      filter: 'blur(30px)',
      transform: 'scale(1.8)',
    //   background: 'radial-gradient(circle, rgba(255,255,255,1) 100%, rgba(255,255,255,0) 60%)',
    background: 'rgb(255,255,255)',
    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(242,250,218,1) 35%, rgba(202,255,211,1) 100%)'
  
    },
  });
const Placed = () => {
      const { user, setUser } = useUser();
      const [isExploding, setIsExploding] = React.useState(true);
    React.useEffect(() => {
        const interval = setInterval(() => {
          setIsExploding(false); // Stop current explosion
          setTimeout(() => setIsExploding(true), 100); // Restart the explosion after a brief pause
        }, 2000); // Restart every 2 seconds
    
        return () => clearInterval(interval); // Clean up the interval on component unmount
      }, []);
  return (
    <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          height: "100vh",
          background: " #B3FFAB",
          background: "-webkit-linear-gradient(to right, #12FFF7, #B3FFAB)",
          background: "linear-gradient(to right, #12FFF7, #B3FFAB)",
          position: 'relative'
        }}
      >
        {
          isExploding && user.coins !== '0' &&
          <Box sx={{ position: 'absolute', top: 0 }}>
            <ConfettiExplosion opacity={0.2} zIndex={2} force={2} duration={8000} particleCount={120} width={1500} />
          </Box>
        }
        <motion.div
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{
            type: "spring", 
            stiffness: 100, 
            damping: 10,  
            duration: 2 
          }}
          zIndex="2"
        >
        <StyledBox sx={{zIndex:'3', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', }}>
         <img style={{zIndex:'2'}} src={placed} alt="order_placed" width='80px'/>
         <Typography variant="h4" pt={2}
         sx={{ color:'darkgreen', zIndex:2}}>ORDER PLACED</Typography>
        </StyledBox>
        </motion.div>
      </Box> 
  )
}

export default Placed