const Booking = require("../models/booking");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const fs = require("fs");
const { updateUserFromBooking } = require("./userController");

// Create a new booking
const createBooking = async (req, res) => {
  const { mobile, area, address, trashtype, pickUpDate } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!address || !mobile || !area || !pickUpDate) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    // Fetch user details based on userId
    const user = await User.findByPk(userId); // Adjust this query to match your ORM/DB setup
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Save booking to database
    const newBooking = await Booking.create({
      userId,
      name: user.name,
      mobile,
      area,
      address,
      trashtype,
      pickUpDate,
      status: "Approval Pending",
    });
    
  
    const coinsEarned = 500;
    user.coins += coinsEarned;
    await user.save();
    
    // Generate new token with updated coins
    const newToken = jwt.sign({
      userRole: user.role,
      coins: user.coins,
      userId: user.id,
      userEmail: user.email,
      userMobile: user.mobile,
      userName: user.name,
      area: user.area,
      address: user.address,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Optionally, save this updated token in a session storage (client-side will handle this)
    // Send the new token in the response to the client
    res.status(201).json({
      message: "Booking created successfully!",
      booking: newBooking,
      token: newToken
    });

    await updateUserFromBooking(userId, address, area);

    // Prepare data for Excels
    const currentDateTime = new Date().toLocaleString();
    const requestData = [
      {
        Name: user.name,
        Mobile: mobile,
        Area: area,
        Address: address,
        TrashType: trashtype,
        PickUpDate: pickUpDate,
        "Booking Date & Time": currentDateTime,
        Status: "pending",
      },
    ];

    const filePath = "./data.xlsx";
    let workbook;

    if (fs.existsSync(filePath)) {
      // If the file exists, update it
      workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const existingData = xlsx.utils.sheet_to_json(sheet);
      existingData.push(requestData[0]);
      const updatedSheet = xlsx.utils.json_to_sheet(existingData);
      workbook.Sheets[workbook.SheetNames[0]] = updatedSheet;
    } else {
      // If the file doesn't exist, create a new one
      workbook = xlsx.utils.book_new();
      const sheet = xlsx.utils.json_to_sheet(requestData);
      xlsx.utils.book_append_sheet(workbook, sheet, "Requests");
    }

    // Write updated data to the file
    xlsx.writeFile(workbook, filePath);

    // res
    //   .status(201)
    //   .json({ message: "Booking created successfully!", booking: newBooking , token : newToken});
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token expired:", error);
      return res.status(401).json({ message: "TokenExpired" }); // Specific message for frontend
    }

    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const bookings = await Booking.findAll({ where: { userId } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

const getAllBookings = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching All bookings", error });
  }
};

const updateBookings = async (req, res) => {
  const {
    id,
    userId,
    name,
    mobile,
    area,
    address,
    trashType,
    assignedTrashman,
    trashmanId,
    pickUpDate,
    status,
    paymentStatus,
    createdAt,
  } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    if (name) booking.name = name;
    if (userId) booking.userId = userId;
    if (trashType) booking.trashType = trashType;
    if (trashType) booking.trashType = trashType;
    if (assignedTrashman) booking.assignedTrashman = assignedTrashman;
    if (trashmanId) booking.trashmanId = trashmanId;
    if (createdAt) booking.createdAt = createdAt;
    if (mobile) booking.mobile = mobile;
    if (area) booking.area = area;
    if (address) booking.address = address;
    if (pickUpDate) booking.pickUpDate = pickUpDate;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    await booking.save();

    res
      .status(200)
      .json({ message: "Scheduled bookings updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking", error });
  }
};

const updateBookingStatus = async (req, res) => {
  const { id, status } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    await booking.save();

    res
      .status(200)
      .json({ message: "Scheduled bookings updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking", error });
  }
};
// Delete Bookings
const deleteBookings = async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Fetch user data by ID
    const bookings = await Booking.findByPk(id);

    if (!bookings) {
      return res.status(400).json({ message: "Booking not found" });
    }

    // Delete the user
    await bookings.destroy();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting Booking:", error);
    res.status(500).json({ message: "Error deleting Booking", error });
  }
};

//cancel the booking (change status of the booking)
const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Check if id is valid
  if (!id) {
    return res.status(400).json({ message: "No booking ID provided" });
  }


  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({ message: "Scheduled bookings has cancelled", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking", error });
  }
};

const pickupBooking = async (req, res) => {
  const { id, calculatedWeight } = req.body; // Destructure request body
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    if (calculatedWeight) {
      booking.calculatedWeight = calculatedWeight;
    }
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Error updating booking", error });
  }
};


module.exports = {
  createBooking,
  getBookings,
  getAllBookings,
  updateBookings,
  updateBookingStatus,
  deleteBookings,
  cancelBooking,
  pickupBooking
};









