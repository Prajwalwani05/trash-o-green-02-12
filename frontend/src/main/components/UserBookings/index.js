import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  styled,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BungalowRoundedIcon from "@mui/icons-material/BungalowRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { ArrowRight, CheckSquare, Leaf, SealCheck, X } from "@phosphor-icons/react";
import ChangeCircleRoundedIcon from "@mui/icons-material/ChangeCircleRounded";
import noBookings from "../assets/noBookings.png";
import done from "../assets/done.png";
import { useUser } from "../../../context/UserContext";
import { jwtDecode } from "jwt-decode";
import VerifiedIcon from '@mui/icons-material/Verified';
const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  gap: theme.spacing(1),
  margin: "auto",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
  width: "100%",

  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [value, setValue] = useState("Approval Pending");
  const navigate = useNavigate();
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking
  const [openDialog, setOpenDialog] = useState(false); // For opening/closing dialog
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false); // For opening/closing snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message to show in snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severity of the snackbar (success or error)
  const [showPopup, setShowPopup] = useState(false); // For opening/closing snackbar
  const [currentStep, setCurrentStep] = useState(0); // Track the step (0: Confirm Weight, 1: Final Confirmation)
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Example: starting with 60 seconds
  const [token, setToken] = useState('');
  const { setNotification } = useUser();
  // Track previous bookings to detect payment status change
const prevBookingsRef = useRef(bookings);

useEffect(() => {
  // Check if there are changes in payment status
  const hasNotPaidBooking = bookings.some(
    (booking) => booking.paymentStatus === "Not Paid"
  );

  // Compare with previous bookings to detect if payment status has changed
  if (hasNotPaidBooking && !prevBookingsRef.current.some((booking) => booking.paymentStatus === "Not Paid")) {
    setTimerActive(true); // Start the timer when a booking becomes "Not Paid"
    setTimeLeft(60); // Reset timer to 60 seconds (or whatever your initial time is)
  } else if (!hasNotPaidBooking) {
    setTimerActive(false); // Stop the timer when there are no "Not Paid" bookings
    setTimeLeft(0); // Reset the timer to 0
  }

  // Update the reference to the current bookings after processing
  prevBookingsRef.current = bookings;

}, [bookings, currentStep]);

// Handle the countdown timer logic
useEffect(() => {
  let timer;
  
  // Start the countdown if the timer is active and timeLeft is greater than 0
  if (timerActive && timeLeft > 0) {
    timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease time by 1 every second
    }, 1000);
  } else if (timeLeft <= 0) {
    setTimerActive(false);  // Stop the timer if timeLeft reaches 0
  }

  // Clean up interval when the component unmounts or the timer changes
  return () => clearInterval(timer);
}, [timerActive, timeLeft]);

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
  
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setBookings(response.data);
            const decoded = jwtDecode(token);
            setToken(decoded);
            const bookingWithWeight = response.data.find((booking) => {
              try {
                const calculatedWeight = booking.calculatedWeight
                  ? JSON.parse(booking.calculatedWeight)
                  : null;
  
                return (
                  calculatedWeight &&
                  Object.keys(calculatedWeight).length > 0 &&
                  booking.trashmanId !== "Not Assigned" &&
                  booking.status !== "Completed" && booking.status !== "Cancelled"
                );
              } catch (error) {
                console.error("Error parsing calculatedWeight:", error);
                return false;
              }
            });
  
            setShowPopup(!!bookingWithWeight);
            setNotification(true);
            setLoading(false);
             // Check if any booking's status is 'Completed' and redirect
             const completedBooking = response.data.find(
              (booking) => booking.status === "Completed"
            );

            if (completedBooking) {
              setValue('Completed')
            }
          } else {
            setBookings([]); // Set bookings to an empty array if no data
            setShowPopup(false);
            setLoading(false);
            setNotification(false);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
          setError("Failed to fetch bookings");
          setLoading(false);
          setShowPopup(false); // Ensure popup is not shown on error
        }
      } else {
        setError("Please log in to view your bookings");
        setLoading(false);
        setShowPopup(false);
      }
    };
  
    let interval;
  
    if (currentStep === 2) {
      interval = setInterval(() => {
        fetchBookings(); // Fetch latest bookings every 5 seconds
      }, 5000);
    } else {
      fetchBookings(); // Fetch immediately for other steps
    }
  
    // Cleanup function to clear the interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentStep, REACT_APP_API_URL]); // Dependency array
  
//   // Handle activating or deactivating the timer based on payment status
// useEffect(() => {
//   const hasNotPaidBooking = bookings.some(
//     (booking) => booking.paymentStatus === "Not Paid"
//   );

//   if (hasNotPaidBooking) {
//     setTimerActive(true);  // Start the timer when there is a "Not Paid" booking
//     setTimeLeft(60);  // Optionally, set the initial time (e.g., 60 seconds)
//   } else {
//     setTimerActive(false);  // Stop the timer if no bookings are "Not Paid"
//     setTimeLeft(0);  // Reset the timer to 0
//   }
// }, [bookings]);

// // Handle the countdown timer logic
// useEffect(() => {
//   let timer;
  
//   // Start the countdown if the timer is active and timeLeft is greater than 0
//   if (timerActive && timeLeft > 0) {
//     timer = setInterval(() => {
//       setTimeLeft((prevTime) => prevTime - 1); // Decrease time by 1 every second
//     }, 1000);
//   } else if (timeLeft <= 0) {
//     setTimerActive(false);  // Stop the timer if timeLeft reaches 0
//   }

//   // Clean up interval when the component unmounts or the timer changes
//   return () => clearInterval(timer);
// }, [timerActive, timeLeft]);


  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status === "Approval Pending" || booking.status === "InProgress"
  );
  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed"
  );
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled"
  );
  const calculateDaysRemaining = (pickUpDate) => {
    const scheduledDate = new Date(pickUpDate);
    const todayDate = new Date();
    const timeDifference = scheduledDate - todayDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  const groupByMonth = (bookings) => {
    return bookings.reduce((groups, booking) => {
      const date = new Date(booking.pickUpDate);
      // const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`; // Month + Year
      const month = date.toLocaleString("default", { month: "short" });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(booking);
      return groups;
    }, {});
  };

  const groupedPendingBookings = groupByMonth(pendingBookings);
  const groupedCompletedBookings = groupByMonth(completedBookings);
  const groupedCancelledBookings = groupByMonth(cancelledBookings);

  // Handle the card click
  const handleCardClick = (booking) => {
    if (selectedBooking === booking) {
      setSelectedBooking(null);
    } else {
      setSelectedBooking(booking);
    }
  };

  const handleCancel = (id) => {
    setBookingToCancel(id); // Store the user id to delete
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleBookingCancel = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  // Handle cancel booking
  const handleCancelConfirm = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `${REACT_APP_API_URL}/api/bookings/cancelBooking/${bookingToCancel}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        // Update the booking status in the state
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === bookingToCancel
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        );
        setOpenDialog(false);
        setSnackbarMessage("Successfully cancelled the booking");
        setSnackbarSeverity("success");
        setOpenSnackbar(true); // Show error snackbar
      } else {
        setOpenDialog(false);
        setSnackbarMessage("Failed to cancel the booking");
        setSnackbarSeverity("success");
        setOpenSnackbar(true); // Show error snackbar
      }
    } catch (err) {
      setSnackbarMessage("Error cancelling the booking");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); // Show error snackbar;
      setOpenDialog(false);
    }
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close snackbar
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      handleClosePopup(); // Close dialog on final confirmation
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };
  return (
    <Box
      py={12}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      sx={{
        backgroundImage:
          "radial-gradient(80% 100% at 50% -20%, rgb(204, 255, 223), transparent)",
      }}
    >
      <Container direction="column" justifyContent="center">
        <CardStyled variant="outlined">
          <Typography component="h6" variant="h6" sx={{ width: "100%" }}>
            My Bookings
          </Typography>

          <Tabs
            sx={{
              "& .MuiTabs-indicator": {
                display: "none", // Hide the indicator
              },
              marginTop: "15px",
              backgroundColor: "#ffffff",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              borderRadius: "10px",
              padding: "5px",
            }}
            value={value}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab
              sx={{
                backgroundColor:
                  value === "Approval Pending" ? "#fff6cc" : "transparent", // Active tab background
                "&:hover": {
                  backgroundColor:
                    value === "Approval Pending" ? "#fff6cc" : "transparent", // Hover effect
                },
                transition: "background-color 0.3s ease",
                margin: "0",
                marginRight: "2px",
              }}
              label="Upcoming"
              value="Approval Pending"
            />
            <Tab
              sx={{
                backgroundColor:
                  value === "Completed" ? "#c7f9cc" : "transparent", // Active tab background
                "&:hover": {
                  backgroundColor:
                    value === "Completed" ? "#c7f9cc" : "transparent", // Hover effect
                },
                transition: "background-color 0.3s ease",
                margin: "0",
                marginRight: "2px",
              }}
              label="Completed"
              value="Completed"
            />
            <Tab
              sx={{
                backgroundColor:
                  value === "Cancelled" ? "#ffb3c1" : "transparent", // Active tab background
                "&:hover": {
                  backgroundColor:
                    value === "Cancelled" ? "#ffb3c1" : "transparent", // Hover effect
                },
                transition: "background-color 0.3s ease",
                margin: "0",
              }}
              label="Cancelled"
              value="Cancelled"
            />
          </Tabs>

          {loading ? (
            <p>Loading bookings...</p>
          ) : error ? (
            error === "No bookings found" ? (
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <img src={noBookings} alt="No bookings found!!" width="150px" />
                <Typography variant="h5">Hey, it feels so light!</Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", fontWeight: "300" }}
                  color="gray"
                >
                  There is nothing in your upcoming bookings.
                </Typography>
                <Button
                  onClick={() => navigate("/booking")}
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
                  LET'S Book NOW
                </Button>
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                alignItems="center"
                justifyContent="center"
                mt={1}
              >
                <img src={noBookings} alt="Your bag is empty!!" width="150px" />
                <Typography variant="h5">Hey, it feels so light!</Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "14px", fontWeight: "300" }}
                  color="gray"
                >
                  There is nothing in your upcoming bookings.
                </Typography>
                <Button
                  onClick={() => navigate("/booking")}
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
                  LET'S Book NOW
                </Button>
              </Box>
            )
          ) : (
            <Box
              mt={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              {(value === "Approval Pending"
                ? groupedPendingBookings
                : value === "Completed"
                ? groupedCompletedBookings
                : groupedCancelledBookings) &&
                Object.keys(
                  value === "Approval Pending"
                    ? groupedPendingBookings
                    : value === "Completed"
                    ? groupedCompletedBookings
                    : groupedCancelledBookings
                ).map((month, idx) => (
                  <Box key={idx} sx={{ width: "100%", marginBottom: "20px" }}>
                    <Typography>{month}</Typography>{" "}
                    {/* Display both month and year */}
                    <Box
                      mt={2}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      {(value === "Approval Pending"
                        ? groupedPendingBookings
                        : value === "Completed"
                        ? groupedCompletedBookings
                        : groupedCancelledBookings)[month].map(
                        (booking, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: "100%",
                              border: "1px solid lightgrey",
                              borderRadius: "12px",
                            }}
                          >
                            <Card
                              onClick={() => handleCardClick(booking)}
                              key={index}
                              sx={{
                                padding: "5px",
                                display: "flex",
                                justifyContent: "space-evenly",
                                gap: 0,
                                alignItems: "center",
                                backgroundColor: "#FFF",
                                cursor: "pointer",
                                border: "none",
                                borderRadius: "12px",
                              }}
                            >
                              {/* <Box>
                          <RecyclingIcon/>
                      </Box> */}
                              <Box>
                                <Typography
                                  color="grey"
                                  sx={{
                                    display: "flex",
                                    color: `${
                                      value === "Approval Pending"
                                        ? "#faa916"
                                        : value === "Completed"
                                        ? "#38b000"
                                        : "#d90429"
                                    }`,
                                    fontWeight: "bold",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "12px",
                                  }}
                                >
                                  {/* {new Date(booking.pickUpDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short", // Short month name
                            // year: "numeric",
                            weekday: "long", // Full day name (e.g., 'Monday', 'Tuesday', etc.)
                          }
                        )} */}
                                  <p>
                                    {new Date(
                                      booking.pickUpDate
                                    ).toLocaleDateString("en-GB", {
                                      weekday: "short", // Full day name (e.g., 'Monday', 'Tuesday', etc.)
                                    })}
                                  </p>
                                  <p>
                                    {new Date(
                                      booking.pickUpDate
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                    })}
                                  </p>
                                </Typography>
                              </Box>
                              <Divider orientation="vertical" flexItem />
                              <Box>
                                <Typography
                                  color="grey"
                                  className="bookingCardCss"
                                  mb={0.5}
                                >
                                  <PlaceRoundedIcon sx={{ fontSize: "15px" }} />
                                  <p>{booking.area}</p>
                                </Typography>
                                <Typography
                                  color="grey"
                                  className="bookingCardCss"
                                >
                                  <AccessTimeFilledIcon
                                    sx={{ fontSize: "14px" }}
                                  />
                                  <p>10.00 - 3.00</p>
                                </Typography>
                              </Box>
                              <Divider orientation="vertical" flexItem />
                              <Box>
                                <Typography
                                  color="grey"
                                  sx={{
                                    fontSize: "12px",
                                    display: "flex",
                                    fontWeight: "bold",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <p>Trashman</p>
                                  <p
                                    style={{
                                      color: `${
                                        value === "Approval Pending"
                                          ? "#faa916"
                                          : value === "Completed"
                                          ? "#38b000"
                                          : "#d90429"
                                      }`,
                                    }}
                                  >
                                    {booking.trashmanId}
                                  </p>
                                </Typography>
                              </Box>

                              {/* <ExpandMoreRoundedIcon
                          sx={{
                            transition: "transform 0.3s ease",
                            transform: selectedBooking === booking ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        /> */}
                            </Card>
                            {/* Conditionally render the details of the selected booking under the specific booking */}
                            {selectedBooking === booking && (
                              <>
                                <Divider />
                                <Box
                                  sx={{
                                    padding: "10px",
                                    borderRadius: "0 0 12px 12px",
                                  }}
                                >
                                  <Typography
                                    className="bookingCardCss"
                                    mb={0.5}
                                  >
                                    <PlaceRoundedIcon
                                      sx={{ fontSize: "16px" }}
                                    />{" "}
                                    <strong>Area:</strong>{" "}
                                    {selectedBooking.area}
                                  </Typography>
                                  <Typography
                                    className="bookingCardCss"
                                    mb={0.5}
                                  >
                                    <BungalowRoundedIcon
                                      sx={{ fontSize: "16px" }}
                                    />{" "}
                                    <strong>Address:</strong>{" "}
                                    {selectedBooking.address}
                                  </Typography>
                                  <Typography
                                    className="bookingCardCss"
                                    mb={0.5}
                                  >
                                    <CalendarMonthRoundedIcon
                                      sx={{ fontSize: "16px" }}
                                    />{" "}
                                    <strong>Pick-up Date:</strong>{" "}
                                    {new Date(
                                      selectedBooking.pickUpDate
                                    ).toLocaleString()}
                                  </Typography>
                                  <Typography
                                    className="bookingCardCss"
                                    mb={0.5}
                                  >
                                    <ArrowOutwardRoundedIcon
                                      sx={{ fontSize: "16px" }}
                                    />{" "}
                                    <strong>Status:</strong>{" "}
                                    {selectedBooking.status}
                                  </Typography>
                                  {/* <Typography className="bookingCardCss"  mb={0.5}>
                         <Man4Rounded sx={{fontSize:'16px'}}/> <strong>Trashman:</strong> {selectedBooking.trashmanName ? selectedBooking.trashmanName : 'Assigned shortly!!'}
                        </Typography> */}
                                  {value === "Approval Pending" && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "end",
                                      }}
                                    >
                                      <Button
                                        onClick={() =>
                                          handleCancel(selectedBooking.id)
                                        }
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        sx={{
                                          marginTop: "5px",
                                          fontSize: "12px",
                                          height: "2rem",
                                          border: "1px solid #c20a0a80",
                                          color: "#c20a0a",
                                        }}
                                      >
                                        Want to cancel ?
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              </>
                            )}
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>
                ))}
            </Box>
          )}
        </CardStyled>
        <Dialog open={openDialog} onClose={handleBookingCancel}>
          <DialogTitle>Confirm Cancelling</DialogTitle>
          <DialogContent>
            Are you sure you want to cancel this booking?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBookingCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCancelConfirm} color="secondary">
              Sure
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>

      {showPopup && (
        <Dialog
          fullWidth
          open={showPopup}
          onClose={(event, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              return; // Prevent dialog from closing
            }
            handleClosePopup(); // Use this for close button or other actions
          }}
          sx={{
            "& .css-1xaxchr-MuiPaper-root-MuiDialog-paper": {
              backgroundColor: "#FFF",
              border: "2px solid #0cd09d",
              paddingBottom: "5px",
              borderRadius: "15px",
            },
          }}
        >
          {/* <DialogTitle textAlign={'center'}>Confirm Weight</DialogTitle> */}
          {currentStep !== 2 && (
            <DialogTitle
              sx={{
                backgroundColor: currentStep !== 2 && "#f0fff1",
                borderBottom: currentStep !== 2 && "1px solid #058c42",
              }}
              textAlign={"center"}
            >
              {currentStep === 0
                ? "Confirm Weight and Price"
                : "Final Confirmation"}
            </DialogTitle>
          )}
          {currentStep === 0 ? (
            <DialogContent sx={{ padding: "15px" }}>
              {bookings.map((booking, index) => {
                // Check if calculatedWeight exists and is a valid string before parsing
                let totalValue = 0;
                let calculatedWeight = {};
                try {
                  calculatedWeight = booking.calculatedWeight
                    ? JSON.parse(booking.calculatedWeight)
                    : {};
                } catch (error) {
                  console.error("Error parsing calculatedWeight:", error);
                }
                return (
                  (booking.status !== "Completed" && booking.status !== "Cancelled") &&
                  <Box key={index} mt={2}>
                    {Object.entries(calculatedWeight).map(([key, values]) => (
                    <>
                    <Box key={key} mt={1} p={1}
                    className="pickupList"
                      sx={{height:'400px',
                           overflowY:'scroll',}}
                      >
                        {Array.isArray(values) && values.length > 0 ? (
                          values.map((item, index) => {
                            const parts = item.split(" - ");
                            const weight = parseFloat(parts[parts.length - 1]); // Get the weight part
                            const pricePerKg = parseFloat(
                              item
                                .split(" -")[1]
                                .replace("Rs.", "")
                                .replace("/kg", "")
                            ); // Extract price per kg
                            const calculatedAmount = weight * pricePerKg; // Calculate the amount for this item
                            totalValue += calculatedAmount; // Add to total
                            // setStateTotalValue(totalValue);
                            return (
                              <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                                alignItems={"flex-start"}
                                mb={1}
                                sx={{
                                  padding: "12px",
                                  borderRadius: "15px",
                                  boxShadow:
                                    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                                }}
                              >
                                <Box>
                                  <Typography
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {item.split(" ")[0]}
                                  </Typography>
                                  <Typography
                                    color="success"
                                    variant="body2"
                                    style={{ fontWeight: "600" }}
                                  >
                                    {item.split(" -")[1]}
                                  </Typography>
                                </Box>
                                <Box
                                  display={"flex"}
                                  flexDirection={"column"}
                                  alignItems={"flex-end"}
                                >
                                  <Box
                                    display={"flex"}
                                    alignItems={"center"}
                                    gap={"5px"}
                                  >
                                    <Typography
                                      style={{
                                        fontSize: "14px",
                                        color: "gray",
                                        fontWeight: "600",
                                      }}
                                    >
                                      WEIGHT:{" "}
                                    </Typography>
                                    <Typography
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {weight.toFixed(2)} Kg
                                    </Typography>
                                  </Box>
                                  <Typography
                                    fontWeight={"600"}
                                    color="green"
                                    display={"flex"}
                                    alignItems={"center"}
                                    gap={"2px"}
                                  >
                                    <X size={12} color="green" />{" "}
                                    {parseFloat(
                                      item
                                        .split(" -")[1]
                                        .replace("Rs.", "")
                                        .replace("/kg", "")
                                    ).toFixed(2)}
                                  </Typography>
                                  <Divider
                                    sx={{
                                      marginTop: "5px",
                                      backgroundColor: "#101010",
                                    }}
                                    flexItem
                                    orientation="horizontal"
                                  />
                                  <Typography
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {" "}
                                    Rs.{" "}
                                    {(
                                      parseFloat(weight) *
                                      parseFloat(
                                        item
                                          .split(" -")[1]
                                          .replace("Rs.", "")
                                          .replace("/kg", "")
                                      )
                                    ).toFixed(2)}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })
                        ) : (
                          <Typography
                            pl={1}
                            color="error"
                            mt={1}
                            variant="body2"
                          >
                            No items
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          color="gray"
                          fontStyle={"italic"}
                          display={"flex"}
                          gap={"5px"}
                        >
                          {" "}
                          <p style={{ color: "red" }}>*</p> Please verify and
                          confirm the weight recorded by our trashman.
                        </Typography>
                      </Box>
                        <Box
                          p={1}
                          px={2}
                          borderRadius={"8px"}
                          color={"hsl(220, 30%, 6%)"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          sx={{
                            backgroundColor: "#f0fff1",
                            padding: "8px 12px",
                            borderRadius: "15px",
                            border: "1px solid rgb(82, 209, 84)",
                          }}
                        >
                          <Typography variant="h6">
                            Total Earnings :{" "}
                          </Typography>
                          <Typography variant="h6">
                            Rs. {totalValue.toFixed(2)}/-
                          </Typography>
                        </Box>
                    </>
                    ))}
                  </Box>
                );
              })}
            </DialogContent>
          ) : currentStep === 1 ? (
            <DialogContent sx={{ padding: "15px" }}>
              {bookings.map((booking, index) => {
                // Check if calculatedWeight exists and is a valid string before parsing
                let totalValue = 0;
                let calculatedWeight = {};
                try {
                  calculatedWeight = booking.calculatedWeight
                    ? JSON.parse(booking.calculatedWeight)
                    : {};
                } catch (error) {
                  console.error("Error parsing calculatedWeight:", error);
                }
                return (
                  (booking.status !== "Completed" && booking.status !== "Cancelled") &&
                  <Box key={index} mt={2}>
                    {Object.entries(calculatedWeight).map(([key, values]) => (
                      <Box key={key} my={1}>
                        {Array.isArray(values) && values.length > 0 ? (
                          values.map((item, index) => {
                            const parts = item.split(" - ");
                            const weight = parseFloat(parts[parts.length - 1]); // Get the weight part
                            const pricePerKg = parseFloat(
                              item
                                .split(" -")[1]
                                .replace("Rs.", "")
                                .replace("/kg", "")
                            ); // Extract price per kg
                            const calculatedAmount = weight * pricePerKg; // Calculate the amount for this item
                            totalValue += calculatedAmount; // Add to total
                            return "";
                          })
                        ) : (
                          <Typography
                            pl={1}
                            color="error"
                            mt={1}
                            variant="body2"
                          >
                            No items
                          </Typography>
                        )}
                        <Box
                          borderRadius={"8px"}
                          color={"hsl(220, 30%, 6%)"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          sx={{
                            padding: "12px",
                            borderRadius: "15px",
                            boxShadow:
                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                          }}
                        >
                          <Typography variant="h6">
                            Total Earnings :{" "}
                          </Typography>
                          <Typography variant="h6">
                            Rs. {totalValue.toFixed(2)}/-
                          </Typography>
                        </Box>
                        <Box
                        mt={1}
                          borderRadius={"8px"}
                          color={"hsl(120, 100.00%, 20.40%)"}
                          display={"flex"}
                          justifyContent={"space-between"}
                          sx={{
                            padding: "12px",
                            borderRadius: "15px",
                            boxShadow:
                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                          }}
                        >
                          <Typography variant="h6">
                            Green Coins Earned :{" "}
                          </Typography>
                         <Box
                         display={"flex"}
                         justifyContent={"space-between"}
                         alignItems={'center'}
                         gap={'5px'}
                         >
                          <Typography variant="h6">
                             {token.coins}
                          </Typography>
                           <Leaf weight="duotone" color="green" size={25}/>
                          </Box>
                        </Box>
                        <Box
                          mt={1}
                          borderRadius={"8px"}
                          color={"hsl(220, 30%, 6%)"}
                          sx={{
                            padding: "12px",
                            borderRadius: "15px",
                            boxShadow:
                              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                          }}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography variant="body2" fontWeight={"600"}>
                              Trashman ID :{" "}
                            </Typography>
                            <Box display={'flex'} gap={'2px'} alignItems={'center'}>
                            <Typography variant="body2" fontWeight={"600"}>
                              {booking.trashmanId}
                            </Typography>
                              <VerifiedIcon sx={{color:'#2E7CE6', fontSize:'16px'}}/>
                            </Box>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography variant="body2" fontWeight={"600"}>
                              Pickup Date :{" "}
                            </Typography>
                            <Typography variant="body2" fontWeight={"600"}>
                              {booking.pickUpDate}
                            </Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography variant="body2" fontWeight={"600"}>
                              Payment Status :{" "}
                            </Typography>
                            <Typography variant="body2" fontWeight={"600"}>
                              {booking.paymentStatus}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          px={0}
                          pt={2}
                          variant="body2"
                          color="gray"
                          fontStyle={"italic"}
                          display={"flex"}
                          gap={"5px"}
                        >
                          {" "}
                          <p style={{ color: "red" }}>*</p> Please ensure this
                          number is linked to a UPI ID. If not, update with
                          another number..
                        </Typography>
                        <Box
                          mt={1}
                          borderRadius={"8px"}
                          color={"hsl(220, 30%, 6%)"}
                          sx={{
                            backgroundColor: "#f0fff1",
                            padding: "8px 12px",
                            borderRadius: "15px",
                            border: "1px solid rgb(97, 237, 115)",
                          }}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            alignItems={"flex-start"}
                          >
                            <Typography variant="h6" fontWeight={"600"}>
                              Mobile No. :{" "}
                            </Typography>
                            <Box
                              display={"flex"}
                              gap={"5px"}
                              alignItems={"center"}
                            >
                              <ChangeCircleRoundedIcon
                                size={25}
                                weight="fill"
                                style={{ color: "#38b000" }}
                              />
                              <Typography variant="h6" fontWeight={"600"}>
                                {booking.mobile}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </DialogContent>
          ) : (
            <DialogContent>

          { bookings.map((booking, index) => (
            (booking.status !== "Completed" && booking.status !== "Cancelled") &&
                <Box
                  sx={{
                    backgroundColor: "#ffffff",
                    padding: "24px",
                    borderRadius: "16px",
                    // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    textAlign: "center",
                  }}
                >
                  {booking.paymentStatus === "Not Paid" ? (
                    
                      timeLeft > 0 ?

                    <Box>
                      <CircularProgress
                      size={60}
                      sx={{ color: "#000", marginBottom: "16px" }}
                    />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "600", color: "#333" }}
                  >
                    Payment in Process
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#555", marginBottom: "16px" }}
                  >
                    Please do not refresh or close the page. Your payment is being
                    processed.
                  </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "green", fontWeight: 500 }}
                    >
                      Estimated time left: {timeLeft}
                    </Typography>
                    </Box>
                    :
                    <Box>
                      <CircularProgress
                      size={60}
                      sx={{ color: "#000", marginBottom: "16px" }}
                    />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: "600", color: "#333" }}
                  >
                    Payment in Process
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#555", marginBottom: "16px" }}
                  >
                    Please do not refresh or close the page. Your payment is being
                    processed.
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'green', fontWeight: 500 }}>
                    Almost there! Finalizing your payment...
                  </Typography>
                    </Box>
                  ) : (
                    // <CheckSquare size={80} weight="duotone"  color="green"/>
                    <Box>
                    <img src={done} alt="img" width={"60px"} />
                    <Typography
                      variant="h6"
                      sx={{ color: "blue", fontWeight: 500 }}
                    >
                      Payment Completed! Thank you.
                    </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </DialogContent>
          )}
          {/* <DialogActions>
            <Button endIcon={<CheckCircle size={20} weight="duotone" color="#affc41"/>} variant="contained" onClick={handleClosePopup}>Confirm Weight</Button>
          </DialogActions> */}
          {currentStep !== 2 && (
            <DialogActions>
              {currentStep === 1 && (
                <Button
                  variant="text"
                  onClick={handleBackStep}
                  color="secondary"
                >
                  Back
                </Button>
              )}
              {currentStep !== 2 && (
                <Button
                  endIcon={
                    <SealCheck size={20} weight="duotone" color="#affc41" />
                  }
                  variant="contained"
                  fullWidth
                  onClick={handleNextStep}
                >
                  {currentStep === 0 ? "Confirm Weight and Price" : "Confirm"}
                </Button>
              )}
            </DialogActions>
          )}
          {/* <DialogTitle textAlign={'center'}>Final Confirmation</DialogTitle> */}
          {/* <DialogContent>
            {bookings.map((booking, index) => {
              // Parse the calculatedWeight string into an object
              const calculatedWeight = JSON.parse(booking.calculatedWeight);
              return (
                <Box key={index} >
                  {Object.entries(calculatedWeight).map(([key, values]) => (
                    <Box key={key} my={2}>
                      {values.length > 0 ? (
                          values.map((item, index) => {
                            const parts = item.split(" - ");
                            const weight = parts[parts.length - 1]; // The weight part is always the last part
                            return(
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'} mb={1} 
                            sx={{backgroundColor: '#e8eaeb6b',
                              padding: '8px',
                              borderRadius: '12px',
                              border: '1px solid #1010102b'}}>
                              <Box>
                               <Typography style={{fontSize:'16px', fontWeight:'600'}}>{item.split(" ")[0]}</Typography>
                               <Typography color="success" variant="body2" style={{fontWeight:'600'}}>{item.split(" -")[1]}</Typography>
                              </Box>                              
                              <Box display={'flex'} alignItems={'center'} gap={'5px'}>
                               <Typography style={{ fontSize: '14px', color:'gray', fontWeight: '600' }}>WEIGHT: </Typography>
                               <Typography style={{fontSize:'16px', fontWeight:'600'}}>{weight}</Typography>
                               <Divider sx={{marginTop:'5px', backgroundColor:'#101010'}} flexItem orientation="horizontal"/>
                               <Typography style={{ fontSize: '16px', fontWeight: '600' }}>Rs. {parseFloat(weight) * parseFloat(item.split(" -")[1].replace("Rs.", "").replace("/kg", ""))}</Typography>
                              </Box>
                            </Box>
                            )
                          })
                      ) : (
                        <Typography pl={1} color="error" mt={1} variant="body2">
                          No items
                        </Typography>
                      )}
                      <Typography variant="body2" color="gray" fontStyle={'italic'} display={'flex'} gap={'5px'}> <p style={{color:'red'}}>*</p> Please verify and confirm the weight recorded by our trashman.</Typography>
                    </Box>
                  ))}
                </Box>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button endIcon={<CheckCircle size={20} weight="duotone" color="#affc41"/>} variant="contained" onClick={handleClosePopup}>Confirm Weight</Button>
          </DialogActions> */}
        </Dialog>
      )}
    </Box>
  );
};

export default UserBookings;
