import express from "express";
import pool from "./db.js";
import cors from "cors";

const app = express();


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use(cors());
app.use(express.json());

/*
 GET /colleges
*/


app.get("/colleges", async (req, res) => {
  try {
    const { search, location, maxFees } = req.query;

    let query = "SELECT * FROM colleges WHERE 1=1";
    let values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND name ILIKE $${values.length}`;
    }

    if (location) {
      values.push(location);
      query += ` AND location = $${values.length}`;
    }

    if (maxFees) {
      values.push(maxFees);
      query += ` AND fees <= $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 GET /colleges/:id
*/
app.get("/colleges/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = await pool.query(
      "SELECT * FROM colleges WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
 GET /compare
*/
app.get("/compare", async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ error: "Please provide IDs" });
    }

    const idArray = ids.split(",").map(Number);

    if (idArray.some(isNaN)) {
      return res.status(400).json({ error: "Invalid IDs" });
    }

    if (idArray.length > 3) {
      return res.status(400).json({ error: "Max 3 colleges allowed" });
    }

    const result = await pool.query(
      "SELECT * FROM colleges WHERE id = ANY($1)",
      [idArray]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 🚀 DEPLOY FIX */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});