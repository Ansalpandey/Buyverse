const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.get("/", (req, res) => {
  res.send("Welcome to Buyverse 👋👋👋");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
