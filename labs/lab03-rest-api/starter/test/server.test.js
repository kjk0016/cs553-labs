import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Lab 3 starter", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/health")
      .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /items returns a list of items", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/items")
      .expect(200);

    expect(response.body).toEqual([
      { id: 1, name: "keyboard", quantity: 10 },
      { id: 2, name: "mouse", quantity: 5 }
    ]);
  });

  test("POST /items creates a new item", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/items")
      .send({ name: "monitor", quantity: 4 })
      .expect(201);

    expect(response.body).toEqual({
      id: 3,
      name: "monitor",
      quantity: 4
    });
  });

  test("GET /items/:id retrieves one item", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/items/1")
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: "keyboard",
      quantity: 10
    });
  });

  test("PUT /items/:id updates an existing item", async () => {
    const app = createApp();

    const response = await request(app)
      .put("/items/1")
      .send({ name: "mechanical keyboard", quantity: 12 })
      .expect(200);

    expect(response.body).toEqual({
      id: 1,
      name: "mechanical keyboard",
      quantity: 12
    });
  });

  test("DELETE /items/:id deletes an existing item", async () => {
    const app = createApp();

    await request(app)
      .delete("/items/1")
      .expect(204);

    await request(app)
      .get("/items/1")
      .expect(404);
  });

  test("missing items return 404", async () => {
    const app = createApp();

    const response = await request(app)
      .get("/items/999")
      .expect(404);

    expect(response.body).toEqual({ error: "Item not found" });
  });

  test("POST /items rejects invalid input", async () => {
    const app = createApp();

    const response = await request(app)
      .post("/items")
      .send({ name: "", quantity: -1 })
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  test("PUT /items/:id rejects invalid input", async () => {
    const app = createApp();

    const response = await request(app)
      .put("/items/1")
      .send({ name: "desk", quantity: -2 })
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });
});
