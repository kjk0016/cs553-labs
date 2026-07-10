export function validateTaskInput(req, res, next) {

  const body = req.body;

  // reject if the title is missing
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return res.status(400).json({ error: "title cant be an empty string" });
  }

  // reject if the course is missing
  if (typeof body.course !== "string" || body.course.trim().length === 0) {
    return res.status(400).json({ error: "course cant be an empty string" });
  }

  // reject if the status is missing
  if (typeof body.completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }

  next();
}