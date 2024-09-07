const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const { connectDB } = require("./db/db");
const limiter = require("./utils/ratelimit.util");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");
require("./utils/messagequeue.util.js");
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Swagger Documentation
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Api Logging
app.use(morgan("combined"));

// Rate limiting
app.use(limiter);

// Connect to MongoDB
connectDB();

// Import Routes
const userRoutes = require("./routes/user.route.js");
const productRoutes = require("./routes/product.route.js");

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Buyverse 👋👋👋");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
