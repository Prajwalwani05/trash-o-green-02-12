import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  MobileStepper,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import { useCart } from "../../../context/CartContext";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QuantityInput from "./IncrementProduct";
import EmptyBagImage from "../assets/emptyBag.png";
import { useNavigate } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { ArrowArcRight, ArrowLeft, ArrowRight, CaretLeft, CheckCircle, Checks } from "@phosphor-icons/react";
import { useUser } from "../../../context/UserContext";
import Placed from "./Placed";
import { ArrowArcLeft } from "@phosphor-icons/react/dist/ssr";

const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  gap: theme.spacing(1),
  margin: 'auto',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  width: '100%',
  backgroundColor:'#FFF',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

export default function Bag() {
  const steps = ["Bag", "Order Summary", "Payment"];
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userArea, setUserArea] = useState("");
  const { cart, removeFromCart, clearCart } = useCart();
  const [coinsDiscount, setCoinsDiscount] = useState(true);
  const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);
  const [activeStep, setActiveStep] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false); // For opening/closing dialog
  const [changedAddress, setChangedAddress] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState({
    productName: [],
    productImage: [],
    originalPrice: [],
    buyingPrice: [],
    quantity: [],
    amount: "",
    area: "",
    address: [],
  });
  console.log(cart);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${REACT_APP_API_URL}/api/bookings/all`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data && response.data.length > 0) {
            const uniqueAddresses = [
              ...new Set(response.data.map((item) => item.address)),
            ];
            setUserAddress(uniqueAddresses);
            const uniqueArea = [
              ...new Set(response.data.map((item) => item.area)),
            ];
            setUserArea(uniqueArea);
          } else {
            setError("No Address found");
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching address:", error);
          setError("Failed to fetch address");
          setLoading(false);
        }
      } else {
        setError("Please log in to view your bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [REACT_APP_API_URL]);

  //Place order
  // purchaseProduct

  const handlePlaceOrder = async (e) => {
    // Update orderData with cart details
    const updatedOrderData = {
      ...orderData,
      productName: cart.map((item) => item.productName),
      originalPrice: cart.map((item) => item.originalPrice),
      buyingPrice: cart.map((item) => item.originalPrice * item.quantity),
      quantity: cart.map((item) => item.quantity),
      amount:
        Object.values(cart)
          .reduce(
            (sum, product) =>
              sum +
              (typeof product.originalPrice === "string"
                ? parseFloat(product.originalPrice) * product.quantity
                : product.originalPrice),
            0
          )
          .toFixed(2) - (user.coins >= 100 ? user.coins/10 : user.coins >= 50 ? user.coins/2 : user.coins),
      area: userArea,
      address: changedAddress || userAddress,
      productImage: cart.map((item) => item.image)
    };
    
    setOrderData(updatedOrderData);
    console.log("Order Data Updated: ", updatedOrderData);
    
    const token = sessionStorage.getItem("token");
  
    try {
      // 1. Make the purchase request
      const response = await fetch(
        `${REACT_APP_API_URL}/api/purchasedProduct/purchaseProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderData: updatedOrderData }),
        }
      );
  
      // Proceed only if the order placement is successful
      if (response.ok) {
        const result = await response.json();
        setOrderPlaced(true);
        clearCart();
        console.log(result);
        // 2. Update user's coins after placing the order, only if coinsDiscount is applied
        if (coinsDiscount === true) {
          const response2 = await fetch(
            `${REACT_APP_API_URL}/api/users/updateUserCoins`,
            {
              method: 'PUT',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ coins: 0 }), // Assuming coins are set to 0 after discount
            }
          );
  
          const coinsResult = await response2.json();
          if (response2.ok) {
            setUser((prevUser) => ({ ...prevUser, coins: 0 }));  // Update coins after successful backend response
          } else {
            console.error('Error updating user coins:', coinsResult.message);
          }
        }
      } else {
        const result = await response.json();
        console.error("Error placing order:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const handleRemoveCoinsDiscount = () => {
    setCoinsDiscount(!coinsDiscount);
  };
  
  // Handlers for step navigation
  const handleNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleChangeAddress = () => {
    setOpenAddDialog(true); // Close the dialog without deleting
  };

  const handleChangeAddressConfirm = () => {
    if (changedAddress.trim()) {
      setUserAddress(changedAddress.trim());
      setChangedAddress("");
      setOpenAddDialog(false);
    } else {
      console.error("Address cannot be empty.");
    }
  };

  

  useEffect(() => {
    const calculateEstimatedDelivery = () => {
      const currentDate = new Date();
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);

      const options = { day: "2-digit", month: "short", year: "numeric" };
      setEstimatedDeliveryDate(newDate.toLocaleDateString("en-US", options));
    };

    calculateEstimatedDelivery();
  }, []);
 
  
  return (
    
      orderPlaced === false ?
      ( 
      <Box
        pt={10}
        pb={10}
        display="flex"
        flexDirection={'column'}
        alignItems="flex-start"
        justifyContent="center"
        sx={{ width: "100%", height: "100vh", overflowY: "scroll", backgroundImage: "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)" }}
      >
          <Box
          pl={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "transparent",
            }}
            mb={1}
          >
            <CaretLeft size={35} onClick={() => navigate('/products')}/>
              <Typography component="h5" variant="h5" sx={{ width: "100%" }}>
                          Bag
              </Typography>
          </Box>
        <Container direction="column" justifyContent="center">
          <CardStyled variant="outlined">
  
          {/* Step 1 */}
          {activeStep === 0 && (
            <Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={{ xs: 1, md: 2 }}
                  columns={{ xs: 1, sm: 8, md: 12 }}
                >
                  {Object.values(cart).length > 0 ? (
                    Object.values(cart).map((product, index) => (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <Box
                          display="flex"
                          gap="10px"
                          sx={{
                            border: "1px solid #e9ecef",
                            padding: "5px",
                            cursor: "pointer",
                            width: "100%",
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.productName}
                            width="18%"
                          />
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Box>
                              <Typography sx={{ fontWeight: "bold" }}>
                                {product.productName}
                              </Typography>
                              <Box display="flex" alignItems="flex-end" gap="5px">
                                <Typography
                                  sx={{ fontSize: "14px", fontWeight: "bold" }}
                                >
                                  Rs. {product.originalPrice}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    textDecoration: "line-through",
                                    textDecorationColor: "gray",
                                  }}
                                >
                                  {" "}
                                  Rs. {product.marketPrice}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "12px", color: "salmon" }}
                                >
                                  (48% OFF)
                                </Typography>
                              </Box>
                              <QuantityInput productId={product.id} />
                            </Box>
                            <CloseRoundedIcon
                              onClick={() => removeFromCart(product.id)}
                              sx={{
                                padding: "0",
                                color: "#adb5bd",
                                fontSize: "16px",
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="100%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img
                        src={EmptyBagImage}
                        alt="Your bag is empty!!"
                        width="150px"
                      />
                      <Typography variant="h5">Hey, it feels so light!</Typography>
                      <Typography variant="h6" sx={{fontSize:'14px', fontWeight:'300'}} color="gray">There is nothing in your bag. Let's add some items.</Typography>
                      <Button
                        onClick={() => navigate("/products")}
                        variant="outlined"
                        sx={{
                          border: "1px solid green",
                          backgroundColor: "#96ff9c5e",
                          color: "#2e7d32",
                          marginTop: "10px",
                        }}
                        color="success"
                        endIcon={<ArrowRight />}
                      >
                        LET'S SHOP NOW
                      </Button>
                    </Box>
                  )}
                </Grid>
                {cart.length > 0 &&
                <Box
                  sx={{ background: "#dffde996", border: "1px solid #b7e4c7" }}
                  mt={2}
                  p={1}
                >
                  <Typography style={{ fontSize: "13px", fontWeight: "100" }}>
                    Deliver to:{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        color: "#111",
                      }}
                    >
                      {user.name && user.name.split(" ").slice(0, 1).join(" ")}
                    </span>
                  </Typography>
                  <ResponsiveEllipsis
                    text={userAddress || "No address provided"}
                    maxLine="1"
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                    style={{ fontSize: "13px", fontWeight: "100" }}
                  />
                  <Button
                    onClick={handleChangeAddress}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{
                      marginTop: "5px",
                      fontSize: "12px",
                      height: "2rem",
                      border: "1px solid #b7e4c7",
                      color: "green",
                    }}
                  >
                    Change Address
                  </Button>
                </Box>
                 }
              </Box>
            </Box>
          )}
          {/* Step 2 */}
          {activeStep === 1 && (
            <Box>
              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={{ xs: 1, md: 2 }}
                  columns={{ xs: 1, sm: 8, md: 12 }}
                >
                  {Object.values(cart).length > 0
                    ? Object.values(cart).map((product, index) => (
                        <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                          <Box
                            display="flex"
                            sx={{
                              border: "1px solid #e9ecef",
                              padding: "2px",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            <Box display="flex" gap="10px" alignItems="center">
                              <img
                                src={product.image}
                                alt={product.productName}
                                width="12%"
                              />
                              <Box>
                                <Typography
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "900",
                                    display: "inline",
                                  }}
                                >
                                  x{product.quantity}
                                </Typography>
                                <Typography
                                  style={{ fontSize: "13px", fontWeight: "100" }}
                                >
                                  Estimated delivery by{" "}
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "15px",
                                      color: "#111",
                                    }}
                                  >
                                    {estimatedDeliveryDate}
                                  </span>
                                </Typography>
                              </Box>
                            </Box>
                            <CloseRoundedIcon
                              onClick={() => removeFromCart(product.id)}
                              sx={{
                                padding: "0",
                                color: "#adb5bd",
                                fontSize: "16px",
                              }}
                            />
                          </Box>
                        </Grid>
                      ))
                    : ""}
                </Grid>
                <Box
                  sx={{
                    backgroundColor: "#f0fff1",
                    boxShadow:
                      "rgba(130, 237, 122, 0.44) 0px 1px 3px 0px, rgba(181, 239, 124, 0.45) 0px 0px 0px 1px",
                  }}
                  p={1}
                  mt={2}
                >
                  <Typography color="#2b2d42" sx={{ fontSize: "13px", fontWeight:'600' }}>
                    PRICE DETAILS ({cart.length}{" "}
                    {cart.length === 1 ? "Item" : "Items"})
                  </Typography>
                 
                    <Box mb={0.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        color="#2b2d42"
                        sx={{ fontSize: "13px" }}
                        mt={2}
                      >
                        Total MRP
                      </Typography>
                      <Typography
                        color="#2b2d42"
                        sx={{ fontSize: "13px" }}
                        mt={2}
                        display="flex"
                        alignItems="center"
                      >
                        <CurrencyRupeeRoundedIcon fontSize="13px" />
                        {Object.values(cart)
                          .reduce(
                            (sum, product) =>
                              sum +
                              (typeof product.marketPrice === "string"
                                ? parseFloat(product.marketPrice) *
                                  product.quantity
                                : product.originalPrice),
                            0
                          )
                          .toFixed(2)}
                      </Typography>
                    </Box>
  
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        color="#2b2d42"
                        sx={{ fontSize: "13px" }}
                        mt={1.5}
                      >
                        Discount on MRP
                      </Typography>
                      <Typography
                        color="#38b000"
                        sx={{ fontSize: "13px" }}
                        display="flex"
                        alignItems="center"
                        mt={1.5}
                      >
                        - <CurrencyRupeeRoundedIcon fontSize="13px" />
                        {Object.values(cart)
                          .reduce(
                            (substract, product) =>
                              substract +
                              (typeof product.marketPrice === "string"
                                ? parseFloat(product.marketPrice) *
                                    product.quantity -
                                  parseFloat(product.originalPrice) *
                                    product.quantity
                                : product.originalPrice),
                            0
                          )
                          .toFixed(2)}
                      </Typography>
                    </Box>
                   {
                     user.coins !== 0 &&
                    <>
                    <Divider flexItem style={{marginTop:'10px'}} />
                   <Box display="flex" justifyContent="space-between">
                     <Typography
                       color="#2b2d42"
                       sx={{ fontSize: "13px" }}
                       mt={0.5}
                     >
                       Coins Discount
                       {
                         coinsDiscount ?
                         <span onClick={handleRemoveCoinsDiscount} style={{backgroundColor:'#f7cad0', padding:'2px 10px', borderRadius:'20px', marginLeft:'10px', fontWeight:'bold', color:'#c1121f', cursor:'pointer', fontSize:'12px'}}>Remove !!</span>
                         :
                         <span onClick={handleRemoveCoinsDiscount} style={{backgroundColor:'#c2f8cb', padding:'2px 10px', borderRadius:'20px', marginLeft:'10px', fontWeight:'bold', color:'green', cursor:'pointer', fontSize:'12px'}}>Add ✅</span>
                       }
                     </Typography>
                     <Typography
                       color="#38b000"
                       sx={{ fontSize: "13px" }}
                       display="flex"
                       alignItems="center"
                       mt={0.5}
                     >
                       {" "}
                       - <CurrencyRupeeRoundedIcon fontSize="13px" />
                       {coinsDiscount ? (user.coins >= 100 ? user.coins/10 : user.coins >= 50 ? user.coins/2 : user.coins) : 0}
                     </Typography>
                   </Box>
                     <Divider flexItem style={{marginTop:'5px'}} />
                    </>
                   }
  
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                      <Typography
                        color="#2b2d42"
                        sx={{ fontSize: "13px" }}
                        mt={user.coins === 0 ? 1.5 : 0.5}
                      >
                        Shipping Fee
                      </Typography>
                      <Typography
                        color="#2b2d42"
                        sx={{ fontSize: "11px", fontWeight: "100" }}
                        mt={0}
                      >
                        Free shipping for you
                      </Typography>
                      </Box>
                      <Typography
                        color="#38b000"
                        sx={{ fontSize: "13px" }}
                        mt={user.coins === 0 ? 1.5 : 0.5}
                      >
                        FREE
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ backgroundColor: "#49a078" }} />
                  <Box display="flex" justifyContent="space-between" mt={1.5} sx={{fontWeight:'600'}}>
                    <Typography>TOTAL AMOUNT</Typography>
                    <Typography sx={{fontWeight:'600'}} display="flex" alignItems="center">
                      {" "}
                      <CurrencyRupeeRoundedIcon fontSize="14px" />
                      {Object.values(cart)
  .reduce(
    (sum, product) =>
      sum +
      (typeof product.originalPrice === "string"
        ? parseFloat(product.originalPrice) * product.quantity
        : product.originalPrice),
    0
  )
  .toFixed(2) -
  (coinsDiscount
    ? (user.coins >= 100
      ? user.coins / 10
      : user.coins >= 50
      ? user.coins / 2
      : user.coins) || 0
    : 0)}
</Typography>

                    {/* </Typography> */}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
       
        {Object.values(cart).length > 0 &&  
          <Box display="flex" justifyContent="space-between" mt={1}>
            <MobileStepper
              variant="text"
              steps={2}
              position="static"
              activeStep={activeStep}
              sx={{ maxWidth: 400, flexGrow: 1 }}
              nextButton={
                activeStep === 1 ? (
                  <Button
                    onClick={handlePlaceOrder}
                    variant="contained"
                    size="small"
                    endIcon={<CheckCircle />}
                  >
                    Confirm Order
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleNext}
                    disabled={activeStep === 1}
                    endIcon={<NavigateNextRoundedIcon />}
                  >
                    Next
                  </Button>
                )
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<NavigateBeforeRoundedIcon />}
                >
                  Back
                </Button>
              }
            />
          </Box>
       }
           </CardStyled>
        </Container>
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add new address</DialogTitle>
          <DialogContent>
            <TextField
              label="Address"
              value={changedAddress}
              onChange={(e) => setChangedAddress(e.target.value)}
              name="address"
              margin="normal"
              required
              fullWidth
              id="address"
              placeholder="XYZ"
              color="primary"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)} color="info">
              Cancel
            </Button>
            <Button
              sx={{
                minWidth: "fit-content",
                fontFamily: '"Inria Sans", serif',
                color: "#F2F7F2",
                borderRadius: "10px",
                backgroundColor: "#3a5a40",
                backgroundImage: "none",
                border: "none",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              onClick={handleChangeAddressConfirm}
              variant="contained"
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      ): ( 
       <Placed />
    )
  );
}
