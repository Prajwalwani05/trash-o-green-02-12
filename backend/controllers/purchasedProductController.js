const User = require("../models/user");
const PurchasedProduct = require("../models/purchasedProduct");
const jwt = require("jsonwebtoken");

  // Purchase new product
  const purchaseProduct = async (req, res) => {
    const { orderData } = req.body; // Extract orderData from req.body
    if (!orderData) {
      return res.status(400).json({ message: "Missing orderData in request body" });
    }
  
    const {
      productName,
      productImage,
      originalPrice,
      buyingPrice,
      quantity,
      amount,
      area,
      address,
    } = orderData;
  
    console.log("Request body:", req.body);
  
    // Validate the fields inside orderData
    if (
      !Array.isArray(productName) ||
      !Array.isArray(productImage) ||
      !Array.isArray(originalPrice) ||
      !Array.isArray(buyingPrice) ||
      !Array.isArray(quantity) ||
      !Array.isArray(area) ||
      !Array.isArray(address) ||
      !amount
    ) {
      return res.status(400).json({ message: "Invalid or missing fields" });
    }
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const userName = decoded.userName;
      const userMobile = decoded.userMobile;
  
      // Fetch user details based on userId
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const areaString = Array.isArray(area) && area.length > 0 ? area[0] : '';
      // Save booking to database
      const purchasing = await PurchasedProduct.create({
        userId,
        userName,
        userMobile,
        productName,
        productImage,
        originalPrice,
        buyingPrice,
        quantity,
        amount,
        address,
        area: areaString ,
        paymentStatus: 'Not Paid',
        orderStatus: 'Pending',
      });
  
      res.status(201).json({ message: "Order placed successfully!", purchasing });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("Token expired:", error);
        return res.status(401).json({ message: "TokenExpired" });
      }
  
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Error placing order", error });
    }
  };

  const getPurchasedProduct = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
  
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const products = await PurchasedProduct.findAll({ where: { userId } });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  };

  const getAllPurchasedProducts = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const products = await PurchasedProduct.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching All Purchased Product", error });
   }
  }
  const updatePurchasedProduct = async (req, res) => {
    const {
      id,
      userName,
      userMobile,
      productName,
      productImage,
      originalPrice,
      buyingPrice,
      quantity,
      amount,
      paymentStatus,
      orderStatus,
      area,
      address,
      createdAt,
    } = req.body;
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
  
    try {
      const product = await PurchasedProduct.findByPk(id);
  
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
      if (userName) product.userName = userName;
      if (userMobile) product.userMobile = userMobile;
      if (productName) product.productName = productName;
      if (productImage) product.productImage = productImage;
      if (originalPrice) product.originalPrice = originalPrice;
      if (buyingPrice) product.buyingPrice = buyingPrice;
      if (quantity) product.quantity = quantity;
      if (amount) product.amount = amount;
      if (area) product.area = area;
      if (paymentStatus) product.paymentStatus = paymentStatus;
      if (orderStatus) product.orderStatus = orderStatus;
      if (address) product.address = address;
      if (createdAt) product.createdAt = createdAt;
      await product.save();
  
      res
        .status(200)
        .json({ message: "Purchased Product updated successfully", product });
    } catch (error) {
      console.error("Error updating purchased product:", error);
      res.status(500).json({ message: "Error updating purchased product", error });
    }
  };
  
  // // Delete Bookings
  const deletePurchasedProduct = async (req, res) => {
    const { id } = req.params;
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header
  
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }
  
    try {
      // Fetch user data by ID
      const product = await PurchasedProduct.findByPk(id);
  
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }
  
      // Delete the user
      await product.destroy();
  
      res.status(200).json({ message: "Purchased Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting Purchased Product:", error);
      res.status(500).json({ message: "Error deleting Purchased Product", error });
    }
  };  


  module.exports = {
    purchaseProduct, getAllPurchasedProducts, updatePurchasedProduct, deletePurchasedProduct, getPurchasedProduct
  };
