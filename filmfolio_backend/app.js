require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const user_routes = require("./routes/user-routes");
const movie_routes = require("./routes/movie-routes");
const watchlist_routes = require("./routes/watchlist_routes");
const review_routes = require("./routes/review-routes");
const adminRoutes = require("./routes/admin-routes");
const { verifyUser } = require("./middlewares/auth");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log(`connected to mongodb database server ${MONGODB_URI}`);

    // Check if an admin exists
    const adminExists = await User.findOne({ userType: "admin" });

    if (!adminExists) {
      // If no admin exists, create a default admin
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || "admin",
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: hashedPassword,
        confirmPassword: hashedPassword,
        userType: "admin",
      });

      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  })
  .catch((err) => console.log(err));

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.static("public"));

app.use("/users", user_routes);

app.use("/movies", movie_routes);

app.use("/movies", verifyUser, review_routes);

app.use("/watchlist", verifyUser, watchlist_routes);

app.use("/admin", verifyUser, adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") res.status(400);
  else if (err.name === "CastError") res.status(400);

  res.json({ error: err.message });
  return; // Add this line to terminate the function after sending the response
});

// Unknown Path
app.use((req, res) => {
  res.status(404).json({ error: "Path Not Found" });
});

module.exports = app;
