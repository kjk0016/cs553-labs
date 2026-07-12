import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

function parseItemId(value) {
  if (!/^\d+$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function sendInvalidId(res) {
  return res.status(400).json({
    error: "Bad Request",
    message: "Item ID must be a positive integer."
  });
}

function sendItemNotFound(res) {
  return res.status(404).json({
    error: "Not Found",
    message: "Item not found."
  });
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }));

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed."
      });
    }
  });

  // Starter route: return every item from the database.
  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT i.id, i.name, i.quantity, i.category_id,
               c.name AS category_name
        FROM items AS i
        LEFT JOIN categories AS c ON c.id = i.category_id
        ORDER BY i.id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  // Starter route: create one item so the client can demonstrate a write.
  app.post("/api/items", async (req, res) => {
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);
    const categoryId = parseItemId(String(req.body?.categoryId ?? ""));

    if (!name || !Number.isInteger(quantity) || quantity < 0 || categoryId === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name, non-negative integer quantity, and valid category are required."
      });
    }

    try {
      const result = await pool.query(
        `
          INSERT INTO items (name, quantity, category_id)
          VALUES ($1, $2, $3)
          RETURNING id, name, quantity, category_id
        `,
        [name, quantity, categoryId]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      if (error.code === "23503") {
        return res.status(400).json({
          error: "Bad Request",
          message: "The selected category does not exist."
        });
      }
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add item."
      });
    }
  });

  // Return one item by ID.
  app.get("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return sendInvalidId(res);
    }

    try {
      const result = await pool.query(
        `
          SELECT id, name, quantity
          FROM items
          WHERE id = $1
        `,
        [id]
      );

      if (result.rowCount === 0) {
        return sendItemNotFound(res);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to load item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load item."
      });
    }
  });

  // Replace one item by ID. PUT requires a complete item representation.
  app.put("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return sendInvalidId(res);
    }

    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const quantity = req.body?.quantity;

    if (!name || !Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name and non-negative integer quantity are required."
      });
    }

    try {
      const result = await pool.query(
        `
          UPDATE items
          SET name = $1, quantity = $2
          WHERE id = $3
          RETURNING id, name, quantity
        `,
        [name, quantity, id]
      );

      if (result.rowCount === 0) {
        return sendItemNotFound(res);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to replace item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to replace item."
      });
    }
  });

  // Partially update one item by ID.
  app.patch("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return sendInvalidId(res);
    }

    const hasName = Object.prototype.hasOwnProperty.call(req.body ?? {}, "name");
    const hasQuantity = Object.prototype.hasOwnProperty.call(req.body ?? {}, "quantity");

    if (!hasName && !hasQuantity) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Provide a name, a quantity, or both."
      });
    }

    const name = hasName && typeof req.body.name === "string" ? req.body.name.trim() : null;
    const quantity = hasQuantity ? req.body.quantity : null;

    if ((hasName && !name) || (hasQuantity && (!Number.isInteger(quantity) || quantity < 0))) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Name must be non-empty and quantity must be a non-negative integer."
      });
    }

    try {
      const result = await pool.query(
        `
          UPDATE items
          SET name = CASE WHEN $1 THEN $2 ELSE name END,
              quantity = CASE WHEN $3 THEN $4 ELSE quantity END
          WHERE id = $5
          RETURNING id, name, quantity
        `,
        [hasName, name, hasQuantity, quantity, id]
      );

      if (result.rowCount === 0) {
        return sendItemNotFound(res);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to update item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update item."
      });
    }
  });

  // Delete one item by ID.
  app.delete("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return sendInvalidId(res);
    }

    try {
      const result = await pool.query(
        `
          DELETE FROM items
          WHERE id = $1
          RETURNING id, name, quantity
        `,
        [id]
      );

      if (result.rowCount === 0) {
        return sendItemNotFound(res);
      }

      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to delete item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete item."
      });
    }
  });

  // Graduate extension: list all categories.
  app.get("/api/categories", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name
        FROM categories
        ORDER BY name ASC
      `);

      res.json({ categories: result.rows });
    } catch (error) {
      console.error("Failed to load categories:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load categories."
      });
    }
  });

  // Graduate extension: create a category.
  app.post("/api/categories", async (req, res) => {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";

    if (!name) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A category name is required."
      });
    }

    try {
      const result = await pool.query(
        `
          INSERT INTO categories (name)
          VALUES ($1)
          RETURNING id, name
        `,
        [name]
      );

      res.status(201).json({ category: result.rows[0] });
    } catch (error) {
      console.error("Failed to add category:", error);
      if (error.code === "23505") {
        return res.status(409).json({
          error: "Conflict",
          message: "That category already exists."
        });
      }
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add category."
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0),
      category_id INTEGER REFERENCES categories(id)
    )
  `);

  // Add the relationship when upgrading an existing starter database.
  await pool.query(`
    ALTER TABLE items
    ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id)
  `);

  await pool.query(`
    INSERT INTO categories (name)
    VALUES ('Accessories'), ('Displays'), ('Processors'), ('Memory')
    ON CONFLICT (name) DO NOTHING
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity, category_id)
        VALUES
          ($1, $2, (SELECT id FROM categories WHERE name = 'Accessories')),
          ($3, $4, (SELECT id FROM categories WHERE name = 'Accessories')),
          ($5, $6, (SELECT id FROM categories WHERE name = 'Displays')),
          ($7, $8, (SELECT id FROM categories WHERE name = 'Processors'))
      `,
      ["Keyboard", 10, "Mouse", 5, "Monitor", 3, "RTX 5090", 1]
    );
  }
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const app = createApp();

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}
