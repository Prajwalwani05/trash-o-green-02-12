const Products = require("../models/products");

const getAllProducts = async (req, res) => {
  // const token = req.headers["authorization"]?.split(" ")[1];

  // if (!token) {
  //   return res.status(400).json({ message: "No token provided" });
  // }
  try {
    const products = await Products.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching All products", error });
  }
};

// Add new product
const addProduct = async(req, res) => {
    const { productName, marketPrice, originalPrice, image, quantity } = req.body;
  
    try {
  
        const newProduct = await Products.create({
            productName,
            marketPrice,
            originalPrice,
            image,
            quantity
        });
  
        res.status(200).json({ message: 'Product Added successfully', newProduct });
    } catch (error) {
        console.error('Error creating product:', error); // Log errors
        res.status(500).json({ message: 'Error creating product', error });
    }
  }

const updateProduct = async (req, res) => {
  const {
    id,
    productName,
    marketPrice,
    originalPrice,
    image,
    quantity,
    createdAt,
  } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    if (productName) product.name = productName;
    if (marketPrice) product.marketPrice = marketPrice;
    if (originalPrice) product.originalPrice = originalPrice;
    if (image) product.image = image;
    if (quantity) product.quantity = quantity;
    if (createdAt) product.createdAt = createdAt;
    await product.save();

    res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error });
  }
};

// // Delete Bookings
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Fetch user data by ID
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    // Delete the user
    await product.destroy();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting Product:", error);
    res.status(500).json({ message: "Error deleting Product", error });
  }
};



module.exports = {
   getAllProducts,
   addProduct,
   updateProduct,
   deleteProduct
};
