const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Connect to your MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL_LOCAL,
      // process.env.MONGO_URL,
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

async function updateIndexes() {
  try {
    const User = mongoose.model('User');

    // Try to drop the old index but catch any errors if the index doesn't exist
    try {
      await User.collection.dropIndex('email_1');
      console.log('Old email index dropped');
    } catch (err) {
      console.log('Index email_1 not found, skipping drop');
    }

    // Create the new compound index
    await User.collection.createIndex({ email: 1, role: 1 }, { unique: true });

    console.log('Indexes updated successfully');
  } catch (error) {
    console.error('Error updating indexes', error);
  }
}


// Export the connectDB function
module.exports = { connectDB };