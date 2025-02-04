// useEffect(() => {
  //   const fetchBookings = async () => {
  //     const token = sessionStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const response = await axios.get(
  //           `${REACT_APP_API_URL}/api/bookings/all`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  
  //         if (response.data && Array.isArray(response.data) && response.data.length > 0) {
  //           setBookings(response.data);
  //           const decoded = jwtDecode(token);
  //           setToken(decoded);
  //           const bookingWithWeight = response.data.find((booking) => {
  //             try {
  //               const calculatedWeight = booking.calculatedWeight
  //                 ? JSON.parse(booking.calculatedWeight)
  //                 : null;
  
  //               return (
  //                 calculatedWeight &&
  //                 Object.keys(calculatedWeight).length > 0 &&
  //                 booking.trashmanId !== "Not Assigned" &&
  //                 booking.status !== "Completed" && booking.status !== "Cancelled"
  //               );
  //             } catch (error) {
  //               console.error("Error parsing calculatedWeight:", error);
  //               return false;
  //             }
  //           });
  
  //           setShowPopup(!!bookingWithWeight);
  //           setNotification(true);
  //           setLoading(false);
  //            // Check if any booking's status is 'Completed' and redirect
  //            const completedBooking = response.data.find(
  //             (booking) => booking.status === "Completed"
  //           );

  //           if (completedBooking) {
  //             setValue('Completed')
  //           }
  //         } else {
  //           setBookings([]); // Set bookings to an empty array if no data
  //           setShowPopup(false);
  //           setLoading(false);
  //           setNotification(false);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching bookings:", error);
  //         setError("Failed to fetch bookings");
  //         setLoading(false);
  //         setShowPopup(false); // Ensure popup is not shown on error
  //       }
  //     } else {
  //       setError("Please log in to view your bookings");
  //       setLoading(false);
  //       setShowPopup(false);
  //     }
  //   };
  
  //   let interval;
  
  //   if (currentStep === 2) {
  //     interval = setInterval(() => {
  //       fetchBookings(); // Fetch latest bookings every 5 seconds
  //     }, 5000);
  //   } else {
  //     fetchBookings(); // Fetch immediately for other steps
  //   }
  
  //   // Cleanup function to clear the interval
  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [currentStep, REACT_APP_API_URL, setNotification]); // Dependency array
  
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
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(false);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const [token, setToken] = useState('');
  const [value, setValue] = useState("Approval Pending");
  const [showPopup, setShowPopup] = useState(false); // For opening/closing snackbar
  const [currentStep, setCurrentStep] = useState(0); // Track the step (0: Confirm Weight, 1: Final Confirmation)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let interval;
    
    const fetchBookings = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your bookings");
        setLoading(false);
        setShowPopup(false);
        setNotification(false);
        return;
      }
  
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBookings(response.data);
          setToken(jwtDecode(token));
  
          const bookingWithWeight = response.data.find((booking) => {
            try {
              const calculatedWeight = booking.calculatedWeight ? JSON.parse(booking.calculatedWeight) : null;
              return (
                calculatedWeight &&
                Object.keys(calculatedWeight).length > 0 &&
                booking.trashmanId !== "Not Assigned" &&
                booking.status !== "Completed" &&
                booking.status !== "Cancelled"
              );
            } catch (error) {
              console.error("Error parsing calculatedWeight:", error);
              return false;
            }
          });
  
          setShowPopup(!!bookingWithWeight);
          setNotification(!!bookingWithWeight);
          setLoading(false);
        } else {
          setBookings([]);
          setShowPopup(false);
          setLoading(false);
          setNotification(false);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings");
        setLoading(false);
        setShowPopup(false);
        setNotification(false);
      }
    };
  
    fetchBookings();
  
    if (currentStep === 2) {
      interval = setInterval(fetchBookings, 5000);
    }
  
    return () => clearInterval(interval);
  }, [currentStep,, REACT_APP_API_URL]);
  
  
  const clearNotification = () => {
    setNotification(false);
    sessionStorage.setItem("notification", "false"); // Persist across refresh
  };
  
  return (
    <BookingContext.Provider value={{clearNotification, bookings, notification, setBookings, setNotification, token, setToken, value, setValue, showPopup, setShowPopup, currentStep, setCurrentStep, loading, setLoading, error, setError }}>
      {children}
    </BookingContext.Provider>
  );
};
