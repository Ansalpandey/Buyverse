const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connectDB } = require("./db/db");
const limiter = require("./utils/ratelimit.util");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Api Logging
app.use(morgan("dev"));

//Swagger Documentation
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rate limiting
app.use(limiter);

// Connect to MongoDB
connectDB();

// Import Routes
const userRoutes = require("./routes/user.route.js");
const productRoutes = require("./routes/product.route.js");
const deliveryRoutes = require("./routes/delivery.route.js");
const sellerRoutes = require("./routes/seller.route.js");

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/delivery", deliveryRoutes);
app.use("/api/v1/sellers", sellerRoutes);
app.use("/api/v1/delivery", deliveryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});