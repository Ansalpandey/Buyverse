const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to your MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL_LOCAL, // Replace with process.env.MONGO_URL if using the production URL
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected successfully!");

    // Update indexes
    await updateIndexes();
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

// Function to drop the old index and create a new one
async function updateIndexes() {
  try {
    const User = mongoose.model('User');

    // Drop the existing index if it exists
    await User.collection.dropIndex('email_1');

    // Create the new compound index
    await User.collection.createIndex({ email: 1, role: 1 }, { unique: true });

    console.log('Indexes updated successfully');
  } catch (error) {
    console.error('Error updating indexes', error);
  }
}

// Export the connectDB function
module.exports = { connectDB };