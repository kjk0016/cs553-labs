import express from "express";
import tasksRouter from "./routes/tasks.js";
import { logEntry } from "./middleware/logger.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(logEntry);

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/tasks", tasksRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Invalid request" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Midterm server listening on port ${PORT}`);
  });
}
