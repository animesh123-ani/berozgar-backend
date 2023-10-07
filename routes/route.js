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
  const { userEmail, password, ProfileImage } = req.body;

  try {
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already Is In Use!!" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userEmail,
      profileImage: ProfileImage,
      password: hashedPassword,
    });

    await user.save();

    const privateUserData = {
      profileImage: user.profileImage,
      role: user.role,
      userEmail: user.userEmail,
      _id: user._id,
    };

    const token = generateToken(privateUserData);

    res.json({
      token,
      user: privateUserData,
    });
  } catch (error) {
    console.error("Failed to register user:", error);
    res.status(500).json({
      message: "SomeThing Went Wrong In my Server Pls Try Again Later 😕",
    });
  }
});

// Login route
Router.post("/login", validateInput, async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(401).json({ message: "You Are Not Registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isEmailisPassword = await bcrypt.compare(userEmail, user.password);
    if (!isPasswordValid) {
      if (userEmail == password) {
        return res
          .status(401)
          .json({ message: "You Created Account Through Email And Password" });
      } else if (!isEmailisPassword) {
        return res
          .status(401)
          .json({ message: "Wrong UserName Of Password credentials" });
      } else {
        return res
          .status(401)
          .json({ message: "You Created Account Through Login With google" });
      }
    }

    const privateUserData = {
      profileImage: user.profileImage,
      role: user.role,
      userEmail: user.userEmail,
      _id: user._id,
    };

    const token = generateToken(privateUserData);

    res.json({
      token,
      user: privateUserData,
    });
  } catch (error) {
    console.error("Failed to login user:", error);
    res.status(500).json({
      message: "SomeThing Went Wrong In my Server Pls Try Again Later 😕",
    });
  }
});

// Protected route
Router.get("/user", authenticateToken, (req, res) => {
  res.json({
    message: "You Are Authenticate",
    user: req.user,
  });
});

// Middleware function to authenticate token
function authenticateToken(req, res, next) {
  const token = req.query.api_key;

  if (!token) {
    return res.status(401).json({ message: "Autherization Failed" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Autherization Failed" });
    }
    req.user = decoded.user;

    next();
  });
}

Router.get("/users", authenticateToken, async (req, res) => {
  const { role } = req.user;
  if (role == "ADMIN") {
    let users = await User.find({}).select({
      userEmail: 1,
      profileImage: 1,
      role: 1,
      _id: 1,
    });
    res.json(users);
  } else {
    res.status(403).json({ message: "you Don't Have Access To This" });
  }
});

// Export the router and authenticateToken middleware
module.exports = { Router, authenticateToken };
