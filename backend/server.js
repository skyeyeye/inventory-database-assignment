const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

/**
 * POST /supplier
 * Create supplier
 */
app.get("/ping", (req, res) => {
  console.log("PING HIT");
  res.json({ message: "pong" });
});
app.post("/supplier", (req, res) => {
    
  const { name, city } = req.body;
    console.log("✅ /supplier route hit", req.body);

  if (!name || !city) {
    return res.status(400).json({ message: "Name and city are required" });
  }

  const query = `INSERT INTO suppliers (name, city) VALUES (?, ?)`;
  db.run(query, [name, city], function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ id: this.lastID, name, city });
  });
});

/**
 * POST /inventory
 * Create inventory item
 */
app.post("/inventory", (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  if (quantity < 0 || price <= 0) {
    return res.status(400).json({ message: "Invalid quantity or price" });
  }

  // Validate supplier exists
  db.get(
    `SELECT id FROM suppliers WHERE id = ?`,
    [supplier_id],
    (err, supplier) => {
      if (!supplier) {
        return res.status(400).json({ message: "Supplier does not exist" });
      }

      const query = `
        INSERT INTO inventory (supplier_id, product_name, quantity, price)
        VALUES (?, ?, ?, ?)
      `;

      db.run(
        query,
        [supplier_id, product_name, quantity, price],
        function (err) {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          res.status(201).json({
            id: this.lastID,
            supplier_id,
            product_name,
            quantity,
            price,
          });
        }
      );
    }
  );
});

/**
 * GET /inventory
 * REQUIRED QUERY:
 * Group inventory by supplier
 * Sort by total inventory value (quantity × price)
 */
app.get("/inventory", (req, res) => {
  const query = `
    SELECT
      s.id AS supplier_id,
      s.name AS supplier_name,
      s.city,
      SUM(i.quantity * i.price) AS total_inventory_value
    FROM suppliers s
    JOIN inventory i ON s.id = i.supplier_id
    GROUP BY s.id
    ORDER BY total_inventory_value DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
