import * as React from "react";
import Box from "@mui/material/Box";
import { Badge, Button, Container, Divider, Typography } from "@mui/material";
import ResponsiveGrid from "./Grid";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import coins from '../assets/coins.png';
import { Leaf, ShoppingBag, WarningDiamond } from "@phosphor-icons/react";
import {useUser} from '../../../context/UserContext';
import TransitionsModal from "../Booking/Modal";
import plantSapling from '../assets/plantSapling.png';

export default function Products() {
  const [wishList, setWishList] = React.useState({});
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { cart } = useCart();
  const token = sessionStorage.getItem("token");
  const [modal, setModal] = React.useState({ open: false, title: '', message: '', action: null, img: '' });
  
  const handleGoToBag = () =>{
    if (!token) {
    setModal({
        open: true,
        title: 'Login Required',
        message: 'Please log in to make a booking!',
        action: () => window.location.href = '/signin', // Redirect to login
        img: <WarningDiamond size={40} weight="duotone" color='#9e2a2b'/>
      });
    }
    else{
      navigate('/products/bag');
    }
  }
  const handleCoinsPage = () => {
    navigate('/mycoins')
  }
  return (
    // <Box 
    // pt={10}
    //   pb={10}
    //   display="flex"
    //   alignItems="center"
    //   justifyContent="center"
    //   sx={{position:'relative', width: "100%",backgroundColor:'#6EB36D', height: "100vh", overflowY: "scroll" }}
    // >
    //   <img src={plantSapling} alt="products" width={300} style={{opacity:'0.7'}}/>
    //   <Typography  sx={{fontSize:'75px', textAlign:'center',lineHeight:'1', position:'absolute',zIndex:'2', color:'#FFF', fontFamily:'Ephesis',filter:'brightness(1.5)', fontWeight:'500'}}>
    //     Coming Soon.
    //   </Typography>
    // </Box>
    <Box
      pt={10}
      pb={10}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "100%", overflowY: "scroll" , backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)"}}
    >
      
      <Container direction="column" justifyContent="center">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "5px",
            padding: "8px",
            backgroundColor: "transparent",
          }}
          mb={2}
        >
          <Box>
            <Typography component="h6" variant="h6" sx={{ width: "100%" }}>
              Products
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Leaf size={25} weight="duotone" color='green'/>
            {/* <img onClick={handleCoinsPage} src={coins} alt="coins" width='30px'/> */}
            {
              user &&
            <Typography mr={1} sx={{ fontWeight: "900" }}>
              {user.coins}
            </Typography>
            
            }
            <Divider orientation="vertical" flexItem />
            <Box>
              <Button
                onClick={() => handleGoToBag()}
                size="small"
                variant="text"
             //   startIcon={<ShoppingBagOutlinedIcon />}
                startIcon={
                  <Badge showZero badgeContent={ Object.values(cart).length} color="success">
                    <ShoppingBag size={25} color="green"  weight= "duotone"/>
                  </Badge>
                }
                sx={{fontWeight:'bold', fontSize:'15px', padding:'0'}}
              >
                {" "}
                Bag
              </Button>
            </Box>
          </Box>
        </Box>
        <TransitionsModal
                  open={modal.open}
                  onClose={() => setModal({ ...modal, open: false })}
                  title={modal.title}
                  message={modal.message}
                  action={modal.action}
                  img={modal.img}
                />
        <ResponsiveGrid wishList ={wishList} setWishList={setWishList}/>
      </Container>
    </Box>
  );
}
