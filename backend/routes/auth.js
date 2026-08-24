const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");


const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );

    stmt.run(name, email, hashedPassword);

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login user
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({
    message: "Login successful",
    token,
    role: user.role,
  });
});

module.exports = router;