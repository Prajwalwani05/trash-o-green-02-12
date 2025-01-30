import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  FormHelperText,
  FormControl,
  Input,
  InputAdornment,
  Divider,
  Button,
} from "@mui/material";
import { ArrowFatLinesRight } from "@phosphor-icons/react";
import axios from "axios";

const ProceedPickup = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const navigate = useNavigate();
  const initialTrashType = booking ? JSON.parse(booking.trashtype) : {};
  const [trashTypeData] = useState(initialTrashType);
  const [calculatedWeight, setCalculatedWeight] = useState({});
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const handleWeightChange = (category, index, value) => {
    setCalculatedWeight((prevData) => {
      const updatedCategory = prevData[category] ? [...prevData[category]] : [];
      updatedCategory[index] = trashTypeData[category][index].split(" - ")[0] + ` - ${value} kg`;
      return { ...prevData, [category]: updatedCategory };
    });
  };
// console.log(calculatedWeight)
const handleConfirmPickup = async () => {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.put(
      `${REACT_APP_API_URL}/api/bookings/pickupBooking`, // No `/id` in the URL
      { 
        id: booking.id, // Include `id` in the request body
        calculatedWeight // Send `calculatedWeight` directly
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // Pass headers separately
      }
    );

    if (response.status === 200) {
      alert("Pickup data updated successfully!");
      navigate("/");
    } else {
      console.error("Error updating data:", response.data);
      alert("Failed to update the data.");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Something went wrong. Please try again.");
  }
};


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
          <Typography pl={1} variant="h6">Trash Details</Typography>
        {booking ? (
          <Box sx={{ padding: "10px" }}>
            {Object.entries(initialTrashType).map(([key, values]) => (
              <Box key={key} my={1}>
                <Typography variant="body2" mb={2}>
                  <strong style={{ display: "flex", alignItems: "center" }}>
                    <ArrowFatLinesRight size={15} weight="fill" color="#40916c" style={{ marginRight: "5px" }} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </strong>
                </Typography>
                {values.length > 0 ? (
                  <ol className="pickupList" style={{ overflow: "scroll", maxHeight: "500px" }}>
                    {values.map((item, index) => (
                      <Box key={index} display="flex" justifyContent="space-between" alignItems="flex-start" pl={3} pt={2}>
                        <li>{item.split(" - ")[0]}:</li>
                        <FormControl variant="standard" sx={{ m: 1, mt: 0, width: "15ch" }}>
                          <Input
                            type="number"
                            onChange={(e) => handleWeightChange(key, index, e.target.value)}
                            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                          />
                          <FormHelperText>Weight</FormHelperText>
                        </FormControl>
                      </Box>
                    ))}
                  </ol>
                ) : (
                  <Typography pl={3} color="error" mt={1} variant="body2">
                    No items
                  </Typography>
                )}
                <Divider style={{ backgroundColor: "#52b788", marginTop: "5px" }} />
              </Box>
            ))}
            <Box display={'flex'} justifyContent={'space-between'}>
            <Button variant="outlined" onClick={() => navigate('/')}>
              Back
            </Button>
            <Button variant="contained" onClick={handleConfirmPickup}>
              Confirm Pickup
            </Button>
            </Box>
          </Box>
        ) : (
          <Typography color="error">No booking data available</Typography>
        )}
      </Container>
    </Box>
  );
};

export default ProceedPickup;
