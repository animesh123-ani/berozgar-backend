// Import necessary modules and setup
const express = require("express");
const Router = express.Router();
const User = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign({ user }, secretKey);
}

// Middleware function for input validation
function validateInput(req, res, next) {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  next();
}

// Registration route
Router.post("/register", validateInput, async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userEmail,
      password: hashedPassword,
    });

    await user.save();

    const token = generateToken(user);

    res.json({ token, user });
  } catch (error) {
    console.error("Failed to register user:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Login route
Router.post("/login", validateInput, async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({ token, user });
  } catch (error) {
    console.error("Failed to login user:", error);
    res.status(500).json({ message: "Failed to login user" });
  }
});

// Protected route
Router.get("/user", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// Middleware function to authenticate token
function authenticateToken(req, res, next) {
  const token = req.query.api_key;

  if (!token) {
    return res.status(401).json({ message: "Please provide a valid token" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token verification failed" });
    }
    req.user = decoded.user;

    next();
  });
}

// Export the router and authenticateToken middleware
module.exports = { Router, authenticateToken };
