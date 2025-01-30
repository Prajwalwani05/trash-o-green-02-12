import { Box, styled, Typography } from "@mui/material";
import React from "react";
import ConfettiExplosion from 'react-confetti-explosion';
import coins from './assets/coins.png';
import CountUp from 'react-countup';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import { useUser } from '../../context/UserContext'; // import the useUser hook

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

const CoinsPage = () => {
  const [isExploding, setIsExploding] = React.useState(true);
  const { user, setUser } = useUser();
console.log(user);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsExploding(false); // Stop current explosion
      setTimeout(() => setIsExploding(true), 100); // Restart the explosion after a brief pause
    }, 2000); // Restart every 2 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);
  
   return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100vh",
        background: " #B3FFAB",
        background: "-webkit-linear-gradient(to right, #12FFF7, #B3FFAB)",
        background: "linear-gradient(to right, #12FFF7, #B3FFAB)",
        position: "relative",
      }}
    >
      {!user ? (
        <Typography
          variant="h2"
          pt={2}
          sx={{
            fontFamily: "Limelight, serif",
            color: "darkgreen",
            zIndex: 2,
          }}
        >
          Please LogIn!
        </Typography>
      ) : (
        <>
          {user.coins > 0 && isExploding && (
            <Box sx={{ position: "absolute", top: 0 }}>
              <ConfettiExplosion
                opacity={0.2}
                zIndex={2}
                force={2}
                duration={8000}
                particleCount={120}
                width={1500}
              />
            </Box>
          )}
          {user.coins > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 2,
              }}
              zIndex="2"
            >
              <StyledBox
                sx={{
                  zIndex: "3",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={coins}
                  alt="coins"
                  width="150px"
                  style={{ zIndex: "2" }}
                />
                <Typography
                  variant="h2"
                  pt={2}
                  sx={{
                    fontFamily: "Limelight, serif",
                    color: "darkgreen",
                    zIndex: 2,
                  }}
                >
                  CONGRATS!
                </Typography>
                <Typography
                  pt={1}
                  variant="h1"
                  sx={{
                    zIndex: 2,
                    color: "darkgreen",
                    fontFamily: "Limelight, serif",
                    fontWeight: "200",
                  }}
                >
                  <CountUp start={0} end={user.coins} duration={3} />
                </Typography>
                <Typography sx={{ zIndex: "2" }} color="darkgreen">
                  Coins Earned
                </Typography>
              </StyledBox>
            </motion.div>
          ) : (
            <Typography
              variant="h2"
              pt={2}
              sx={{
                fontFamily: "Limelight, serif",
                color: "darkgreen",
                zIndex: 2,
              }}
            >
              No Coins Earned Yet!
            </Typography>
          )}
        </>
      )}
    </Box>
  );
  
};

export default CoinsPage;
