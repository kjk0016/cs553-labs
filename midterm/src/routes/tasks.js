import { Router } from "express";
import { validateTaskInput } from "../middleware/validateTaskInput.js";
const router = Router();

// This data is stored in memory and resets whenever the server restarts.
let nextId = 3;
const tasks = [
  {
    id: "1",
    title: "Watch Week 5 lecture",
    course: "CS553",
    completed: false
  },
  {
    id: "2",
    title: "Submit midterm",
    course: "CS553",
    completed: false
  }
];

function taskLocation(id) {
  // find the index of the task within the in memory array
  return tasks.findIndex((task) => task.id === id);
}

/* Moved to middleware file
// validator function
function validateTaskInput(body) {

  // reject if the title is missing
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return "title cant be an empty string";
  }

  // reject if the course is missing
  if (typeof body.course !== "string" || body.course.trim().length === 0) {
    return "course cant be an empty string";
  }

  // reject if the status is missing
  if (typeof body.completed !== "boolean") {
    return "completed must be a boolean";
  }

  // return null to signal that validator passed, if no checks fail
  return null;
}
*/

// return all tasks for get /api/tasks
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

router.get("/:id", (req, res) => {

  // search task array for specified id. If not present return an error, but if found return the associated task
  const task = tasks.find((currentTask) => currentTask.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(200).json(task);
});

router.post("/", validateTaskInput, (req, res) => {

  // create the requested tasks
  const task = {
    id: String(nextId),
    title: req.body.title.trim(),
    course: req.body.course.trim(),
    completed: req.body.completed
  };

  // assign the created task the correct id and push it to the task array
  nextId += 1;
  tasks.push(task);

  return res.status(201).json(task);
});

router.put("/:id", validateTaskInput, (req, res) => {

  // search for the existing task
  const index = taskLocation(req.params.id);

  // if the task is not found return an error
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }


  const task = {
    id: req.params.id,
    title: req.body.title.trim(),
    course: req.body.course.trim(),
    completed: req.body.completed
  };

  // insert the created task in the correct spot
  tasks[index] = task;

  return res.status(200).json(task);
});

router.patch("/:id", (req, res) => {

  // search for the existing task
  const index = taskLocation(req.params.id);

  // if the task is not found return an error
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const task = tasks[index];

  // For requests to update the title, make sure the new title is valid, then update the title
  if (typeof req.body.title === "string" && req.body.title.trim().length > 0) {
    task.title = req.body.title.trim();
  }

  // For requests to update the course, make sure the new course is valid, then update the course
  if (typeof req.body.course === "string" && req.body.course.trim().length > 0) {
    task.course = req.body.course.trim();
  }

  // For requests to update the completion status, make sure the new status is valid, then update the status
  if (typeof req.body.completed === "boolean") {
    task.completed = req.body.completed;
  }

  return res.status(200).json(task);
});

router.delete("/:id", (req, res) => {
  
  // search for the existing task
  const index = taskLocation(req.params.id);
  
  // if the task is not found return an error
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // remove the task from the array
  tasks.splice(index, 1);

  return res.status(204).send();
});

export default router;
