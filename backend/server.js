const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONNECT DB
connectDB();

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/external", require("./routes/external"));
app.use("/api/myrecipes", require("./routes/myrecipes"));
app.use("/api/favorites", require("./routes/favorites"));


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// START SERVER
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
