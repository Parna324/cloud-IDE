require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

app.get("/", (req, res) => {
  res.json({ message: "Auth Service Running" });
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "User registered",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5001, () => {
  console.log("Auth service running on port 5001");
});
