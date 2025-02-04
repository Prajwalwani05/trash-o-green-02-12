import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Card,
  Divider,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import noBookings from "../assets/3991843.jpg";


const TrashMan = () => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // Get mobile number from session storage

    // Fetch assigned trashman bookings from backend
    const fetchAssignedBookings = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_API_URL}/api/trashmen/assignedTrashmen`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setBookings(response.data.bookings); // Assuming backend sends the bookings as part of the response
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedBookings();
  }, [REACT_APP_API_URL]);
  
  const handleProceedPickup = (booking) =>{
    navigate('/proceedPickup', { state: { booking } });
  }
  const validBookings = bookings.filter(
    (booking) =>
      booking.status !== "Completed" &&
      booking.calculatedWeight === null &&
      booking.paymentStatus !== "Paid"
  );
  
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        height:'100vh',
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        backgroundImage:
          "radial-gradient(80% 50% at 50% -20%, rgb(204, 255, 223), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage: "none",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          gap:'10px',
          flexDirection: "column",
          alignItems: "space-between",
          pt: { xs: 12, sm: 14 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Typography pl={1} variant="h6" mb={1}>Scheduled Bookings</Typography>

        {loading ? (
          <CircularProgress sx={{ marginTop: 4 }} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : 
         validBookings.length === 0 ? (
                      // Show "No Bookings" message only if there are no valid bookings
                      <Box
                        display="flex"
                        flexDirection="column"
                        width="100%"
                        alignItems="center"
                        justifyContent="center"
                        mt={12}
                      >
                        <img src={noBookings} alt="No bookings found!!" width="150px" />
                        <Typography variant="h5">Hey, it feels so light!</Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: "14px", fontWeight: "300" }}
                          color="gray"
                        >
                          There is nothing in your scheduled bookings.
                        </Typography>
                      </Box>
                    )
                    : validBookings.map((booking, index) => (
                        <Box  key={index} sx={{ width: "100%", border:'1px solid lightgrey', borderRadius:'12px'}}>
              <Card
                key={index}
                sx={{
                  padding: "5px",
                  display: "flex",
                  flexDirection:'column',
                  gap: 1,
                  justifyContent:'center',
                  // alignItems: "center",
                  backgroundColor: "#FFF",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "12px",
                }}
              >
                <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  gap: 0,
                  alignItems: "center",}}
                >
                <Box>
                  <Typography
                    color="grey"
                    sx={{
                      display: "flex",
                      color: "#000",
                      fontWeight: "bold",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    <p>
                      {new Date(booking.pickUpDate).toLocaleDateString(
                        "en-GB",
                        {
                          weekday: "short", // Full day name (e.g., 'Monday', 'Tuesday', etc.)
                        }
                      )}
                    </p>
                    <p>
                      {new Date(booking.pickUpDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                        }
                      )}
                    </p>
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ color: "#000", fontWeight: "bold",}}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      display: "flex",
                      fontWeight: "bold",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p>{booking.area}</p>
                    <p>
                    10.00 - 3.00
                    </p>
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ color: "#000", fontWeight: "bold",}}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      display: "flex",
                      fontWeight: "bold",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p>Trashman Id</p>
                    <p>
                      {booking.trashmanId}
                    </p>
                  </Typography>
                </Box>
                </Box>
                <Divider />
                <Box display={'flex'} justifyContent={'center'}>
                  <Button onClick={() => handleProceedPickup(booking)} fullWidth variant="contained">Pickup</Button>
                </Box>
              </Card>
                        </Box>
                    ))
                 }
      </Container>
    </Box>
  );
};

export default TrashMan;
