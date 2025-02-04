import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Badge, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const bellRef = useRef(null); // Ref for the bell icon

  // // Simulate a new notification arriving after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewNotification(true); // Set new notification
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={bellRef}>
      {/* Notification Bell with Badge */}
      <Badge color="error" variant={hasNewNotification ? "dot" : "standard"}>
        <motion.div
          animate={hasNewNotification ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          onClick={setHasNewNotification} // Reset when clicked
          style={{ cursor: "pointer" }}
        >
          <NotificationsRoundedIcon sx={{ fontSize: 28, color: "#ff9800" }} />
        </motion.div>
      </Badge>
    </div>
  );
};

export default NotificationBell;
