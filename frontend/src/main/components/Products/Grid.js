import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../loader';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function ResponsiveGrid({wishList, setWishList}) {
    const [products, setproducts] = React.useState([]);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    const { addToCart, cart } = useCart();
    const navigate = useNavigate();
// console.log(addToCart)
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
    
      const handleAddToCart = (product) => {
        // Check if the product is already in the cart
        if (!cart[product.id]) {
          addToCart(product); // Add product to cart
        } else {
          console.log(`Product ${product.id} is already in the cart`);
        }
        // Toggle wishlist status
        setWishList((prevWishlist) => ({
          ...prevWishlist,
          [product.id]: !prevWishlist[product.id],
        }));
      };
      
      const handleButtonClick = (product) => {
        if (wishList[product.id]) {
          navigate('/products/bag'); // Navigate to cart page
        } else {
          handleAddToCart(product); // Add to cart
        }
      };
      

  return (
      <Box sx={{ flexGrow: 1 }}>
        {
          loading ? 
          <Loader />
          :
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {products.map((product, index) => (
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <Box sx={{cursor:'pointer', width:'100%'}}>
                  <img src={product.image} alt={product.productName} width='100%'/>
                      <Button
                      onClick={() => handleButtonClick(product)}
                      fullWidth
                      sx={{
                      fontFamily: '"Inria Sans", serif',
                      backgroundImage: 'none',
                      border: '1px solid lightgray',
                      fontSize: '12px',
                      borderRadius: '0',
                      color: wishList[product.id] ? '#FFF' : 'inherit',
                      backgroundColor: wishList[product.id] ? '#4a4e69' : 'none',
                      }}
                      variant="outlined"
                      endIcon={
                          wishList[product.id] ? (
                          <ArrowRightAltRoundedIcon sx={{ fontSize: '14px', color: 'salmon' }} />
                      ) : (
                          <ShoppingBagOutlinedIcon sx={{ fontSize: '14px' }} />
                      )
              }
              >
                    {wishList[product.id] ? 'GO TO BAG' : 'ADD TO BAG'}
                </Button>
                
                  <Typography  sx={{fontWeight:'bold'}}>{product.productName}</Typography>
                  <Box display='flex' alignItems='flex-end' gap='5px'>
                  <Typography sx={{fontSize:'14px', fontWeight:'bold'}}>Rs. {product.originalPrice}</Typography>
                  <Typography sx={{fontSize:'12px', textDecoration:'line-through', textDecorationColor:'gray'}}>Rs. {product.marketPrice}</Typography>
                  <Typography sx={{fontSize:'12px', color:'salmon'}}>(48% OFF)</Typography>
                  </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        }
      </Box>
  );
}
