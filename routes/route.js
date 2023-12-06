// Import necessary modules and setup
const express = require("express");
const Router = express.Router();
const User = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const objectId = require("mongoose").Types.ObjectId;

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
      _id: user._id,
    };

    const token = generateToken(privateUserData);

    res.json({
      token,
      user,
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
      _id: user._id,
    };

    const token = generateToken(privateUserData);

    res.json({
      token,
      user,
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
    message: "You Are Authenticated",
    user: req.user,
  });
});

// Middleware function to authenticate token
async function authenticateToken(req, res, next) {
  const token = req.query.api_key;

  if (!token) {
    return res.status(401).json({ message: "Autherization Failed" });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Autherization Failed" });
    }
    let user = await User.findById(new objectId(decoded.user._id)).select({
      password: 0,
    });
    if (!user) {
      return res.status(403).json({ message: "Autherization Failed" });
    }

    req.user = user;

    next();
  });
}

Router.get("/users", authenticateToken, async (req, res) => {
  const { role } = req.user;
  if (role == "ADMIN") {
    let users = await User.find({})
      .select({
        userEmail: 1,
        profileImage: 1,
        role: 1,
        _id: 1,
      })
      .sort({
        _id: -1,
      });
    res.json(users);
  } else {
    res.status(403).json({ message: "you Don't Have Access To This" });
  }
});

Router.put("/changeRole", authenticateToken, async (req, res) => {
  try {
    const { role, userEmail } = req.user;
    const { id } = req.query;

    // Check if the user has admin role
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "You don't have access to this" });
    }

    // Check if the provided user ID exists
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Define an array of root admin emails
    const rootAdminEmails = [
      "animeshkum723126@gmail.com",
      "souravhit2226@gmail.com",
      "saikatmalik234@gmail.com",
    ];

    if (user.userEmail == userEmail) {
      return res
        .status(401)
        .json({ message: "you can't modify your own Admin Access" });
    }

    // Check if the user's email is a root admin email
    if (rootAdminEmails.includes(user.userEmail)) {
      return res
        .status(403)
        .json({ message: "You can't modify the role of a root admin" });
    }

    // Toggle the user's role
    user.role = user.role === "ADMIN" ? "USER" : "ADMIN";

    // Save the updated user
    await user.save();

    res.json({ message: "Access Modified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong in our server" });
  }
});

// Export the router and authenticateToken middleware
module.exports = { Router, authenticateToken };
