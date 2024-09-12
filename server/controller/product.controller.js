const Product = require("../model/product.model");
const User = require("../model/user.model");
const DeliveryAgent = require("../model/delivery.model");
const mongoose = require("mongoose");
const uploadImagesToS3 = require("../utils/imageupload");

exports.createProduct = async (req, res) => {
  const { role } = req.body;

  if (role !== "Seller") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const { name, price, description, countInStock, category, seller, rating } =
      req.body;

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
        stock: product.countInStock,
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

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
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

    res.status(200).json({ product });
  } catch (error) {
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

exports.getSellerProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the seller ID being passed
    console.log(`Fetching products for seller with ID: ${id}`);

    // Check if the seller exists in the database
    const seller = await User.findById(id);

    if (!seller) {
      console.log(`Seller with ID: ${id} not found`);
      return res.status(404).json({ message: "Seller not found" });
    }

    // Log if the seller is found
    console.log(`Seller with ID: ${id} found`);

    // Check if the user is a seller
    if (seller.role !== "Seller") {
      console.log(
        `User with ID: ${id} is not a seller, current role: ${seller.role}`
      );
      return res.status(400).json({ message: "User is not a seller" });
    }

    // Log if the user has a seller role
    console.log(`User with ID: ${id} is a seller`);

    // Fetch all products associated with this seller
    const products = await Product.find({ seller: id });

    // Log the number of products found for the seller
    console.log(`Found ${products.length} products for seller with ID: ${id}`);

    res.status(200).json({ products });
  } catch (error) {
    // Log any error that occurs during execution
    console.error(`Error fetching products for seller with ID: ${id}`, error);
    res.status(500).json({ message: error.message });
  }
};

// Get the products in a category
exports.getCategoryProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products within a price range
exports.getPriceRangeProducts = async (req, res) => {
  try {
    const { min, max } = req.params;

    // Convert parameters to numbers
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    // Validate if minPrice and maxPrice are valid numbers
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ message: "Invalid price range" });
    }

    // Fetch products within the specified price range
    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Return the products found
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    // Log and return any error that occurs
    console.error("Error fetching products by price range:", error);
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

    const deliveryAgent = await DeliveryAgent.findById(product.deliveryAgent);

    res.status(200).json({ deliveryAgent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a delivery agent to a product
exports.assignDeliveryAgent = async (req, res) => {
  try {
    const { productId, deliveryAgentId } = req.body;

    // Check if the product id is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    // Check if the delivery agent id is valid
    if (!mongoose.Types.ObjectId.isValid(deliveryAgentId)) {
      return res.status(400).json({ message: "Invalid delivery agent id" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deliveryAgent = await DeliveryAgent.findById(deliveryAgentId);

    if (!deliveryAgent) {
      return res.status(404).json({ message: "Delivery agent not found" });
    }

    // Assign the delivery agent to the product
    product.deliveryAgent = deliveryAgentId;

    // Save the product
    await product.save();

    res.status(200).json({ message: "Delivery agent assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the seller of a product
exports.getSeller = async (req, res) => {
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

    const seller = await Seller.findById(product.seller);

    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
