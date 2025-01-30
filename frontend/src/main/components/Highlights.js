// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid2';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { HandHeart, Recycle, Trash, TrendUp, Truck, Wallet } from '@phosphor-icons/react';
// import { styled } from '@mui/material';

// const items = [
//   {
//     icon: <Trash size={32} weight="duotone" />,
//     title: 'Efficient Trash Collection',
//     description:
//       'Our team ensures timely and hassle-free collection of trash and scrap, keeping your spaces clean and organized.',
//   },
//   {
//     icon: <Recycle size={32} weight="duotone" />,
//     title: 'Eco-Friendly Disposal',
//     description:
//       'We follow eco-conscious methods for disposing and recycling collected materials, minimizing environmental impact.',
//   },
//   {
//     icon: <Truck size={32} weight="duotone" />,
//     title: 'Reliable Pickup Services',
//     description:
//       'Enjoy dependable pickup schedules tailored to your needs, ensuring your trash and scrap are collected without delay.',
//   },
//   {
//     icon: <Wallet size={32} weight="duotone" />,
//     title: 'Competitive Pricing',
//     description:
//       'Get the best value for your scrap with our transparent and competitive pricing, ensuring you maximize your returns.',
//   },
//   {
//     icon: <HandHeart size={32} weight="duotone" />,
//     title: 'Responsive Support',
//     description:
//       'Our customer support team is always ready to assist you, providing quick responses to any inquiries or service requests.',
//   },
//   {
//     icon: <TrendUp size={32} weight="duotone" />,
//     title: 'Sustainable Growth',
//     description:
//       'Partner with us to contribute to a circular economy, where trash and scrap are transformed into valuable resources.',
//   },
// ];

// export default function Highlights() {
//   return (
//     <Box
//       id="highlights"
//       sx={{
//         pt: { xs: 4, sm: 12 },
//         pb: { xs: 8, sm: 16 },
//         color: 'white',
//         bgcolor: '#0c2e10',
//       }}
//     >
//       <Container
//         sx={{
//           position: 'relative',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: { xs: 3, sm: 6 },
//         }}
//       >
//         <Box
//           sx={{
//             width: { sm: '100%', md: '60%' },
//             textAlign: { sm: 'left', md: 'center' },
//           }}
//         >
//           <Typography textAlign={'center'} component="h2" variant="h4" gutterBottom>
//           Why Trash-O-Green
//           </Typography>
//           <Typography variant="body1" sx={{ color: 'grey.400' }}>
//           Explore why our service stands out: efficiency in collection, eco-friendly disposal, 
//           customer-centric approach, and innovative recycling methods. Experience reliable support and 
//           precision in handling every piece of scrap.
//           </Typography>
//         </Box>
//         <Grid container spacing={2}>
//           {items.map((item, index) => (
//             <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
//               <Stack
//                 direction="column"
//                 component={Card}
//                 spacing={1}
//                 useFlexGap
//                 sx={{
//                   color: 'inherit',
//                   p: 3,
//                   height: '100%',
//                   borderColor: '#64bb5b4d',
//                   backgroundColor: '#18371e',
//                 }}
//               >
//                 <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
//                 <div>
//                   <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
//                     {item.title}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: 'grey.400' }}>
//                     {item.description}
//                   </Typography>
//                 </div>
//               </Stack>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HandHeart, Recycle, Trash, TrendUp, Truck, Wallet } from '@phosphor-icons/react';

const items = [
    {
      icon: <Trash size={32} weight="duotone" />,
      title: 'Efficient Trash Collection',
      description:
        'Our team ensures timely and hassle-free collection of trash and scrap, keeping your spaces clean and organized.',
    },
    {
      icon: <Recycle size={32} weight="duotone" />,
      title: 'Eco-Friendly Disposal',
      description:
        'We follow eco-conscious methods for disposing and recycling collected materials, minimizing environmental impact.',
    },
    {
      icon: <Truck size={32} weight="duotone" />,
      title: 'Reliable Pickup Services',
      description:
        'Enjoy dependable pickup schedules tailored to your needs, ensuring your trash and scrap are collected without delay.',
    },
    {
      icon: <Wallet size={32} weight="duotone" />,
      title: 'Competitive Pricing',
      description:
        'Get the best value for your scrap with our transparent and competitive pricing, ensuring you maximize your returns.',
    },
    {
      icon: <HandHeart size={32} weight="duotone" />,
      title: 'Responsive Support',
      description:
        'Our customer support team is always ready to assist you, providing quick responses to any inquiries or service requests.',
    },
    {
      icon: <TrendUp size={32} weight="duotone" />,
      title: 'Sustainable Growth',
      description:
        'Partner with us to contribute to a circular economy, where trash and scrap are transformed into valuable resources.',
    },
  ];

  export default function Highlights() {
  const controls = useAnimation();

  const [ref, inView] = useInView({
    threshold: 0.1, // Adjust the threshold for earlier visibility
    rootMargin: '0px 0px 600px 0px', // Adjust rootMargin for earlier trigger
    triggerOnce: true,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const boxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#0c2e10',
      }}
    >
      <Container
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography textAlign={'center'} component="h2" variant="h4" gutterBottom>
            Why Trash-O-Green
          </Typography>
          <Typography variant="body1" textAlign={'center'} sx={{ color: 'grey.400' }}>
            Explore why our service stands out: efficiency in collection, eco-friendly disposal,
            customer-centric approach, and innovative recycling methods. Experience reliable support and
            precision in handling every piece of scrap.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={index}
              ref={ref}
              component={motion.div}
              initial="hidden"
              animate={controls}
              variants={boxVariants}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: 'inherit',
                  p: 3,
                  height: '100%',
                  borderColor: '#64bb5b4d',
                  backgroundColor: '#18371e',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
