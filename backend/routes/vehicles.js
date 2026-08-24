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
router.post("/", authenticateToken, (req, res) => {
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

// Purchase a vehicle - decrease stock
router.post("/:id/purchase", authenticateToken, (req, res) => {
  const { id } = req.params;

  const vehicle = db
    .prepare("SELECT * FROM vehicles WHERE id = ?")
    .get(id);

  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  if (vehicle.quantity <= 0) {
    return res.status(400).json({ error: "Vehicle is out of stock" });
  }

  db.prepare(
    "UPDATE vehicles SET quantity = quantity - 1 WHERE id = ?"
  ).run(id);

  res.json({
    message: "Vehicle purchased successfully"
  });
});

// Restock a vehicle - increase stock
router.post("/:id/restock", authenticateToken, (req, res) => {
  const { id } = req.params;

  const vehicle = db
    .prepare("SELECT * FROM vehicles WHERE id = ?")
    .get(id);

  if (!vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  db.prepare(
    "UPDATE vehicles SET quantity = quantity + 1 WHERE id = ?"
  ).run(id);

  res.json({
    message: "Vehicle restocked successfully"
  });
});

module.exports = router;