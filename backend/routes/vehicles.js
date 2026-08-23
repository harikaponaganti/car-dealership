const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Get all vehicles
router.get("/", (req, res) => {
  const vehicles = db.prepare("SELECT * FROM vehicles").all();
  res.json(vehicles);
});

// Add a vehicle
router.post("/", authenticateToken, (req, res) =>  {
  const { make, model, category, price, quantity } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO vehicles (make, model, category, price, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      make,
      model,
      category,
      price,
      quantity
    );

    res.json({
      message: "Vehicle added successfully",
      id: result.lastInsertRowid
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;