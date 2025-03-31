// server.cjs
const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ Correct MongoDB URI (Replace with your actual credentials)
const MONGODB_URI =
  "mongodb+srv://admin:admin@main.nt92qex.mongodb.net/stutter_db?retryWrites=true&w=majority&appName=main";

let mongoClient;
let usersCollection;

// ✅ MongoDB Connection Function
async function connectToMongoDB() {
  try {
    if (!mongoClient) {
      mongoClient = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      await mongoClient.connect();
      console.log("✅ Connected to MongoDB Atlas");
    }
    const db = mongoClient.db("stutter_db");
    usersCollection = db.collection("users");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process if connection fails
  }
}

// ✅ Login Endpoint
app.post("/api/login", async (req, res) => {
  try {
    await connectToMongoDB();
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
      userType,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Signup Endpoint
app.post("/api/signup", async (req, res) => {
  try {
    await connectToMongoDB();
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      userType,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      isActive: true,
    };

    const result = await usersCollection.insertOne(newUser);
    if (!result.acknowledged || !result.insertedId) {
      throw new Error("Failed to create user");
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
