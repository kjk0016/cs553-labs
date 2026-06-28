import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  function validateItemInput(body) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      return "name must be a non-empty string";
    }

    if (typeof body.quantity !== "number" || Number.isNaN(body.quantity) || body.quantity < 0) {
      return "quantity must be a number greater than or equal to zero";
    }
    return null;
  }

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // TODO: Return all items.
  app.get("/items", (req, res) => {
     res.status(200).json(items);
  });

  // TODO: Return one item by ID.
  app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = items.find((currentItem) => currentItem.id === id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(item);
  });

  // TODO: Create a new item.
  app.post("/items", (req, res) => {
    const validationError = validateItemInput(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const item = {
      id: nextId,
      name: req.body.name,
      quantity: req.body.quantity
    };

    nextId += 1;
    items.push(item);

    res.status(201).json(item);
  });

  // TODO: Update an existing item.
  app.put("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = items.find((currentItem) => currentItem.id === id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const validationError = validateItemInput(req.body);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    item.name = req.body.name;
    item.quantity = req.body.quantity;

    res.status(200).json(item);
  });

  // TODO: Delete an existing item.
  app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const itemIndex = items.findIndex((currentItem) => currentItem.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    items.splice(itemIndex, 1);

    res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}
