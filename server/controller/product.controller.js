const Product = require("../model/product.model");
const User = require("../model/user.model");
const DeliveryAgent = require("../model/delivery.model");
const mongoose = require("mongoose");

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