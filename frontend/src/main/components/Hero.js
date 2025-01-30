import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Avatar, Card, CircularProgress, Divider, Paper, styled, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FAQ from "./FAQ";
import { jwtDecode } from "jwt-decode";
import Admin from "./Admin";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GreenCoinCard from "./card";
import { useUser } from "../../context/UserContext";
import Highlights from "./Highlights";
import Footer from "./Footer";
import { motion } from "framer-motion";
import Carousel from "react-material-ui-carousel";
import vid from './assets/tog3.mp4';
import {
  BeerBottle,
  BeerStein,
  Cloud,
  CloudMoon,
  Cpu,
  Gear,
  GoogleCardboardLogo,
  HandCoins,
  Leaf,
  Magnet,
  Moon,
  Newspaper,
  Plug,
  PuzzlePiece,
  Receipt,
  Scales,
  ShieldCheck,
  SignIn,
  SprayBottle,
  Sun,
  SunHorizon,
  Tag,
  Toolbox,
  Trash,
  Truck,
} from "@phosphor-icons/react";
import {
  BatteryCharging,
  CloudFog,
  IceCream,
} from "@phosphor-icons/react/dist/ssr";
import pickupImg from "./assets/file3.png";
import paymentImg from "./assets/file1.png";
import videoSrc from "./assets/tog3.mp4";
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import TrashMan from "./TrashMan";
// import product1 from './assets/diana-light-3-6mITmMyGI-unsplash.jpg';
// import product2 from './assets/characterBooking.png';
// import product3 from './assets/characterPayment1.png';
import Example from "./CarousalHome";
import character from './assets/character.png';
import characterBooking from './assets/characterBooking.png';
import characterPayment from './assets/characterPayment1.png';
import CarousalProducts from "./carousal";
import axios from "axios";
import AnimatedBell from "./AnimatedBell";


const items = [
  {
      name: "Book a pickup",
      description: "The Rise of Remote Work: Benefits, Challenges, and Future Trends",
      img: characterBooking,
  },
  {
      name: "Pickup at your address",
      description: "Understanding Blockchain Technology: Beyond Cryptocurrency",
      img: character,
  },
  {
      name: "Receive payment",
      description: "Mental Health in the Digital Age: Navigating Social Media and Well-being",
      img: characterPayment,
  }
];
// const products = [
//   {
//       img: characterBooking,
//   },
//   {
//       img: character,
//   },
//   {
//       img: characterPayment,
//   }
// ];
const categories = [
  {
    label: "E-waste",
    icon: <Trash size={25} weight="duotone" color="green" />,
  },
  {
    label: "Plastic",
    icon: <BeerBottle size={25} weight="duotone" color="#f87060" />,
  },
  {
    label: "Newspaper",
    icon: <Newspaper size={25} weight="duotone" color="#832161" />,
  },
  {
    label: "Iron",
    icon: <Magnet size={25} weight="duotone" color="#4a4e69" />,
  },
  {
    label: "Cardboards",
    icon: <GoogleCardboardLogo size={25} weight="duotone" color="#20bf55" />,
  },
  {
    label: "Aluminium",
    icon: <BeerStein size={25} weight="duotone" color="#4a4e69" />,
  },
  {
    label: "Steel",
    icon: <Toolbox size={25} weight="duotone" color="##00cecb" />,
  },
  {
    label: "Refrigerator",
    icon: <IceCream size={25} weight="duotone" color="#eb5e28" />,
  },
  {
    label: "AC",
    icon: <CloudFog size={25} weight="duotone" color="#3c6e71" />,
  },
  {
    label: "Machines",
    icon: <Gear size={25} weight="duotone" color="#284b63" />,
  },
  {
    label: "Battery",
    icon: <BatteryCharging size={25} weight="duotone" color="#004e98" />,
  },
  {
    label: "Copper",
    icon: <Plug size={25} weight="duotone" color="#ba181b" />,
  },
  {
    label: "Wires",
    icon: <Cloud size={25} weight="duotone" color="#ba181b" />,
  },
  {
    label: "CPU/LCD/LED",
    icon: <Cpu size={25} weight="duotone" color="#284b63" />,
  },
  {
    label: "Toys",
    icon: <PuzzlePiece size={25} weight="duotone" color="#725ac1" />,
  },
  {
    label: "Bottles",
    icon: <SprayBottle size={25} weight="duotone" color="#00cecb" />,
  },
];
export default function Hero() {
  const [adminFlag, setAdminFlag] = React.useState('user');
  const [userNameToShow, setUserNameToShow] = React.useState("");
  const [tokenFlag, setTokenflag] = React.useState(false);
  const navigate = useNavigate();
  const { user , notification} = useUser();
  const [value, setValue] = React.useState(0);
  const [firstChar, setFirstChar] = React.useState("");
  const [products, setproducts] = React.useState([]);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(user);
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 8) {
    groupedCategories.push(categories.slice(i, i + 8));
  }
  // const token = sessionStorage.getItem("token");
  
 React.useEffect(() => {
  if (user && user.userName && user.userMobile) {
    setUserNameToShow(user.userName.split(" ")[0]);
    setFirstChar(user.userName.charAt(0).toUpperCase());
    setTokenflag(true);
    if (user.userRole === 'Admin') {
        setAdminFlag('Admin');
    }
    else if(user.userRole === 'Trashman'){
      setAdminFlag('Trashman')
    }
    else{
      setAdminFlag('user');
    }
} else {
    setAdminFlag('user');
    setTokenflag('user');
}
  }, [user]); // Include `user` as a dependency if it changes
 
  React.useEffect(() => {
    const fetchProducts = async () => {
      // const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${REACT_APP_API_URL}/api/products/getAllProducts`  
          );

          if (response.data && response.data.length > 0) {
            setproducts(response.data);
            console.log(response.data)
          } else {
            setError("No products found");
          }
          setTimeout(() => {
            setLoading(false);
          }, 5000);
        } catch (error) {
          console.error("Error fetching products:", error);
          setError("Failed to fetch products");
          setLoading(false);
        }
      
    };

    fetchProducts();
  }, [REACT_APP_API_URL]);

  const getGreetings = () => {
    let currentHour = new Date().getHours();
    console.log(currentHour)
    if (currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };
  const handleCoinsPage = () => {
    navigate("/mycoins");
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        backgroundImage:
          "radial-gradient(80% 50% at 50% -20%, rgb(204, 255, 223), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage: "none",
        }),
      })}
    >
      {adminFlag === 'Admin' ? (
        <Admin />
      ) :
      adminFlag === 'Trashman' ? (
        <TrashMan />
      ) :
      (
        <>
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "space-between",
              pt: { xs: 12, sm: 14 },
              pb: { xs: 8, sm: 12 },
              paddingLeft: "0",
              paddingRight: "0",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                px={2}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
                mb={2}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-end",
                    width: "100%",
                  }}
                >
                  {/* <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{
                      backgroundColor: "#FFF",
                      borderRadius: "10px",
                      maxWidth: "50px",
                      boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                      maxHeight: "50px",
                      padding: "5px",
                    }}
                  > <img src={tree} alt="profile" width="100%" height="100%" />
                  </Box> */}
                  <Avatar
                    sx={{
                      bgcolor: "#036666",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.30)",
                    }}
                  >
                    {
                    firstChar ? 
                    firstChar : ""}
                  </Avatar>
                  <Box
                    display={"flex"}
                    justifyContent={"flex-start"}
                    flexDirection={"column"}
                  >
                    <Box display={"flex"} alignItems={"center"} gap={"5px"}>
                      <Typography
                        sx={{ fontWeight: "600", color: "text.secondary" }}
                      >
                        Hello
                      </Typography>
                      <Typography
                        sx={{ fontWeight: "600", color: "text.secondary" }}
                      >
                       {
                        userNameToShow ? 
                        userNameToShow : ""
                       }
                      </Typography>
                      {/* <span className="handWave"><img src="https://stefantopalovicdev.vercel.app/static/media/waving.1bae5fcfb51082b5c2b4.png" width="25px" alt=""/></span> */}
                      {/* <HandWaving size={20} weight="fill" color="#b07d62" style={{filter:'drop-shadow(3px 5px 4px rgba(222, 171, 144, 0.76))'}}/> */}
                    </Box>
                    {/* <SunHorizon size={25} weight="duotone" color="#f77f00"/>
                    <Sun size={25} weight="duotone" color="#f77f00"/> */}
                    <Typography
                      display={"flex"}
                      gap={"5px"}
                      alignItems={"center"}
                      lineHeight={"1"}
                      fontSize={"18px"}
                      fontFamily={"Merriweather , serif"}
                      fontWeight={"400"}
                    >
                      {getGreetings()}{" "}
                      {getGreetings() === "Good Morning!" ? (
                        <SunHorizon
                          size={25}
                          weight="duotone"
                          color="#f77f00"
                        />
                      ) : getGreetings() === "Good Afternoon!" ? (
                        <Sun size={25} weight="duotone" color="#f77f00" />
                      ) : (
                        <CloudMoon size={25} weight="fill" color="#1565c0" />
                      )}
                    </Typography>
                  </Box>
                </Box>
                {tokenFlag ? (
                  notification ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      padding: "8px",
                      backgroundColor: "transparent",
                    }}
                    onClick={handleCoinsPage}
                  >
                    {/* <img src={coin} alt="coins" width="30px" /> */}
                    <AnimatedBell />
                  </Box>
                  ) : (
                    <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                      padding: "8px",
                      backgroundColor: "transparent",
                    }}
                    onClick={handleCoinsPage}
                  >
                    {/* <img src={coin} alt="coins" width="30px" /> */}
                    <Leaf size={32} weight="duotone" color="green" />
                    {user && (
                      <Typography sx={{ fontWeight: "900" }} variant="h6">
                        {user.coins}
                      </Typography>
                    )}
                                        {/* <AnimatedBell /> */}

                  </Box>
                  )
                ) : (
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      navigate("/signin");
                    }}
                  >
                    <ExitToAppRoundedIcon style={{color:'#00798c'}}/>
                  </Button>
                )}
              </Box>
            </motion.div>

            <Stack
              spacing={2}
              useFlexGap
              mt={2}
              pb={1}
              sx={{ alignItems: "center", width: { xs: "100%" } }}
            >
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#414833",
                    fontWeight: "bold",
                    fontFamily: '"Inria Sans", serif',
                    width: { sm: "100%" },
                  }}
                >
                  Doorstep, Online Trash Collection Service in Pune
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Box display="flex" alignItems="center">
                  <Typography
                    sx={{
                      color: "#706F6B",
                      fontWeight: "bold",
                      fontFamily: '"Inria Sans", serif',
                    }}
                  >
                    For Households
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  <Typography
                    sx={{
                      color: "#706F6B",
                      fontWeight: "bold",
                      fontFamily: '"Inria Sans", serif',
                    }}
                  >
                    For Business
                  </Typography>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  useFlexGap
                  sx={{ pt: 0, width: { xs: "100%", sm: "350px" } }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      width: "100%",
                      fontFamily: '"Inria Sans", serif',
                      color: "#F2F7F2",
                      borderRadius: "10px",
                      backgroundColor: "#3a5a40",
                      border: "none",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                    onClick={() => navigate("/booking")}
                    className="buttons"
                  >
                    Book Request
                  </Button>
                </Stack>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ textAlign: "center" }}
                >
                  Got junk? We'll handle the mess, so you can stress less!
                </Typography>
              </motion.div>
            </Stack>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              style={{ paddingBottom: "20px" }}
            >
              <Typography
                pl={2}
                component="h2"
                variant="h4"
                gutterBottom
                color="#343a40"
                textAlign={"center"}
              >
                What we recycle
              </Typography>
              <Carousel
                autoPlay={true}
                stopAutoPlayOnHover={true}
                swipe={true}
                cycleNavigation={true}
                interval={3000}
                indicators={false}
                navButtonsAlwaysInvisible={true} // Added to hide navigation buttons
                height={170}
              >
                {groupedCategories.map((group, groupIndex) => (
                  <Stack
                    key={groupIndex}
                    mt={2}
                    direction="row"
                    flexWrap="wrap"
                    spacing={0}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ gap: 1, width: "100%" }}
                  >
                    {group.map((item, index) => (
                      <Box
                      onClick={() => navigate('/booking')}
                        ml={0}
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 84,
                          height: 70,
                          margin: "0",
                          borderRadius: "10px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          backgroundColor: "none",
                        }}
                      >
                        <Typography>{item.icon}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ))}
              </Carousel>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              style={{ paddingBottom: "20px" }}
            >
              <Typography
                pt={2}
                pl={3}
                component="h2"
                variant="h4"
                gutterBottom
                color="#343a40"
                textAlign={"center"}
              >
                Our Eco-Products
              </Typography>
              {/* <CarousalProducts /> */}
              {loading && <CircularProgress />}
              {error && <p>{error}</p>} 
              {!loading && !error && <CarousalProducts/>}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              style={{  }}
            >
              <Highlights />
            </motion.div>

            {/* <motion.div  initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              style={{marginBottom:'10px', }}
              >
             <Typography pt={2} pl={3} component="h2" variant="h4" gutterBottom color='#343a40' textAlign={'center'}>Why Trash-O-Green</Typography>
            <SpeechBubbleComponent />
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.4 }}
              style={{ margin: "10px",borderRadius:'0px', backgroundColor:'#785964' , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'}}
            >
              <Typography
                pt={2}
                pl={3}
                component="h2"
                variant="h4"
                gutterBottom
                color="#FFF"
                textAlign={"center"}
              >
                How it works
              </Typography>
              <Box >
                <Example items={items}/>
              </Box>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.6 }}
            >
              <GreenCoinCard tokenFlag={tokenFlag} />
            </motion.div>
            <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.75)', // Soft green background
                  borderRadius: '0px',
                  boxShadow:' rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
                  py: 3,
                  mt: 1,
                  textAlign: 'center',
                  mx: 3,
                  border:'1px solid #FFF', overflow: 'hidden' 
                }}>
              <video 
                src={vid} 
                width="100%" // Set a larger width than the container
                controls 
                autoPlay 
                loop 
                muted
                style={{
                  borderRadius:'20px',
                  clipPath: 'inset(0px 36px 0px 37px)', // Crop 50px from both left and right
                }}
              />
            </Box>

            <Box
              pb={1}
              sx={{
                backgroundRepeat: "no-repeat",
                backgroundColor: "transparent",
              }}
              mt={2}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Typography
                p={2}
                lineHeight={"1.4"}
                component="h2"
                variant="h4"
                gutterBottom
              >
                For Whom
              </Typography>
              <Box
                p={0.5}
                display={"flex"}
                alignItems={"flex-start"}
                justifyContent={"center"}
              >
                <Box
                  p={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexWrap={"wrap"}
                  sx={{
                    backgroundImage:
                      "radial-gradient(80% 60% at 50% 50%, rgba(224, 253, 218, 0.68), transparent)",
                  }}
                >
                  <Typography variant="h6" fontSize={"16px"}>
                    FOR HOUSEHOLDS
                  </Typography>
                  <Box
                    display={"flex"}
                    gap={"10px"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Box
                      p={2}
                      boxShadow={
                        "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
                      }
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      gap={"10px"}
                    >
                      <Box
                        p={1}
                        sx={{
                          borderRadius: "50%",
                          width: "fit-content",
                          aspectRatio: "1",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                      >
                        <Truck size={32} weight="duotone" color="#036666" />
                      </Box>
                      <Typography>On-Demand Doorstep Pickups</Typography>
                    </Box>
                    {/* <Divider flexItem orientation="horizontal" style={{backgroundColor:'#78c6a3'}}/> */}
                    <Box
                      p={2}
                      boxShadow={
                        "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
                      }
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      gap={"10px"}
                    >
                      <Box
                        p={1}
                        sx={{
                          borderRadius: "50%",
                          width: "fit-content",
                          aspectRatio: "1",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                      >
                        <Scales size={32} weight="duotone" color="#036666" />
                      </Box>
                      <Typography>Accurate Digital Weighing</Typography>
                    </Box>
                    {/* <Divider flexItem orientation="horizontal" style={{backgroundColor:'#78c6a3'}}/> */}
                    <Box
                      p={2}
                      boxShadow={
                        "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
                      }
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      gap={"10px"}
                    >
                      <Box
                        p={1}
                        sx={{
                          borderRadius: "50%",
                          width: "fit-content",
                          aspectRatio: "1",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                      >
                        <ShieldCheck
                          size={32}
                          weight="duotone"
                          color="#036666"
                        />
                      </Box>
                      <Typography>Safety (Trained & Verified Staff)</Typography>
                    </Box>
                  </Box>
                </Box>
                {/* <Divider flexItem orientation="vertical" style={{backgroundColor:'#d8f3dc'}}/> */}
                <Box
                  p={1}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexWrap={"wrap"}
                  sx={{
                    backgroundImage:
                      "radial-gradient(80% 60% at 50% 50%, rgba(224, 253, 218, 0.68), transparent)",
                  }}
                >
                  <Typography variant="h6" fontSize={"16px"}>
                    FOR BUSINESS
                  </Typography>
                  <Box
                    mt={1}
                    display={"flex"}
                    gap={"10px"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Box
                      p={1.5}
                      boxShadow={
                        "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
                      }
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      gap={"10px"}
                    >
                      <Box
                        p={1}
                        sx={{
                          borderRadius: "50%",
                          width: "fit-content",
                          aspectRatio: "1",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                      >
                        <HandCoins size={32} weight="duotone" color="#036666" />
                      </Box>
                      <Typography>Formal payment and documentation</Typography>
                    </Box>
                    {/* <Divider flexItem orientation="horizontal" style={{backgroundColor:'#78c6a3'}}/> */}
                    <Box
                      p={3}
                      pb={3.5}
                      boxShadow={
                        "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
                      }
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      gap={"10px"}
                    >
                      <Box
                        p={1}
                        sx={{
                          borderRadius: "50%",
                          width: "fit-content",
                          aspectRatio: "1",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                      >
                        <Receipt size={32} weight="duotone" color="#036666" />
                      </Box>
                      <Typography>Sustainability Report </Typography>
                    </Box>
                    {/* <Divider flexItem orientation="horizontal" style={{backgroundColor:'#78c6a3'}}/> */}
                    <Box
                      p={4}
                      pb={2.8}
                      boxShadow={
                        "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
                      }
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      textAlign={"center"}
                      gap={"10px"}
                    >
                      <Box
                        p={1}
                        sx={{
                          borderRadius: "50%",
                          width: "fit-content",
                          aspectRatio: "1",
                          backgroundColor: "#FFF",
                          boxShadow:
                            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                        }}
                      >
                        <Tag size={32} weight="duotone" color="#036666" />
                      </Box>
                      <Typography>Competitive Price</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* <Testimonials /> */}
            {/* <Features /> */}
            <FAQ />
            <Divider />
            <Footer />
          </Container>
        </>
      )}
    </Box>
  );
}
