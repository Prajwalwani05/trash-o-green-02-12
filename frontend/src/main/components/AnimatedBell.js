import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Badge, Snackbar, Alert } from "@mui/material";

const NotificationBell = () => {
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const bellRef = useRef(null); // Ref for the bell icon

  // Simulate a new notification arriving after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewNotification(true); // Set new notification
      setOpenSnackbar(true); // Show Snackbar Alert
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle closing the Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={bellRef}>
      {/* Notification Bell with Badge */}
      <Badge color="error" variant={hasNewNotification ? "dot" : "standard"}>
        <motion.div
          animate={hasNewNotification ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          onClick={() => setHasNewNotification(false)} // Reset when clicked
          style={{ cursor: "pointer" }}
        >
          <NotificationsRoundedIcon sx={{ fontSize: 28, color: "#ff9800" }} />
        </motion.div>
      </Badge>

      {/* Snackbar Alert Below the Bell */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={80000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          position: "absolute",
          top: "50px", // Position below the bell
          left: "-200%",
          transform: "translateX(-50%)",
          width: "auto",
        }}
      >
        <Alert  onClose={handleCloseSnackbar} severity="info" variant="filled">
          📢 New Notification Received!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationBell;
