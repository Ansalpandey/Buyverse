const Product = require("../model/product.model");
const uploadImagesToS3 = require("../utils/imageupload");
const DeliveryAgent = require("../model/delivery.model");
const User = require("../model/user.model");
const mongoose = require("mongoose");
// Get Total Products in Stock
exports.getTotalProductsInStock = async (req, res) => {
  try {
    const products = await Product.find();

    let totalStock = 0;

    products.forEach((product) => {
      totalStock += product.countInStock;
    });

    res.status(200).json({ totalStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Total Products Sold
exports.getTotalProductsSold = async (req, res) => {
  try {
    const products = await Product.find();

    let totalSold = 0;

    products.forEach((product) => {
      totalSold += product.countSold;
    });

    res.status(200).json({ totalSold });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      role,
      name,
      price,
      description,
      countInStock,
      category,
      seller,
      rating,
    } = req.body;
    if (role !== "Seller") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (
      !name ||
      !price ||
      !description ||
      !countInStock ||
      !category ||
      !seller ||
      !rating
    ) {
      return res.status(400).json({
        message:
          "Name, price, description, stock, category, seller, and rating are required",
      });
    }

    // Check if images are provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    // Upload images to S3 and get their URLs
    const imageUrls = await uploadImagesToS3(req.files);

    // Create a new product with image URLs
    const product = new Product({
      name,
      price,
      description,
      countInStock,
      category,
      images: imageUrls, // Store image URLs in an array
      seller,
      rating,
    });

    // Save the product
    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        countInStock: product.countInStock,
        category: product.category,
        images: product.images, // Return the image URLs
        seller: product.seller,
        rating: product.rating,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update the stock of a product
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the stock
    product.countInStock = stock;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the rating of a product
exports.updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the rating
    product.rating = rating;

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Rating updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the stock of a product
exports.getStock = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ stock: product.countInStock });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the delivery agent of a product
exports.getDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deliveryAgent = await DeliveryAgent.findById(product.deliveryAgentId);

    res.status(200).json({ deliveryAgent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Delivery Agents
exports.getAllDeliveryAgents = async (req, res) => {
  try {
    // Find all users with the role of "Delivery Agent"
    const deliveryAgents = await User.find({ role: "Delivery Agent" });

    // If no delivery agents are found, return a message
    if (deliveryAgents.length === 0) {
      return res.status(404).json({ message: "No Delivery Agents found" });
    }

    // Return the list of delivery agents
    res.status(200).json({ message: "Delivery Agents found", deliveryAgents });
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ message: error.message });
  }
};

// Assign a Delivery Agent to a Product
exports.assignDeliveryAgent = async (req, res) => {
  try {
    const { id, deliveryAgent } = req.body;

    // Check if the product id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Check if the delivery agent id is valid
    if (!mongoose.Types.ObjectId.isValid(deliveryAgent)) {
      return res.status(400).json({ message: "Invalid delivery agent id" });
    }

    // Find the product
    const product = await Product.findById(id);

    // If the product is not found, return a message
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the delivery agent
    const agent = await User.findById(deliveryAgent);

    // If the delivery agent is not found, return a message
    if (!agent) {
      return res.status(404).json({ message: "Delivery Agent not found" });
    }

    // Assign the delivery agent to the product
    product.deliveryAgentId = deliveryAgent;

    // Save the updated product
    await product.save();

    // Return a success message
    res.status(200).json({ message: "Delivery Agent assigned successfully" });
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product
    product.name = name;
    product.price = price;
    product.description = description;
    product.stock = stock;

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await product.remove();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};