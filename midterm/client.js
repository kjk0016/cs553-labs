const BASE_URL = "http://localhost:3000";

// function to print test call results so I don't have to copy and paste this a ton
async function show(label, response) {
  console.log("\n" + label);
  console.log("Status:", response.status);

  if (response.status === 204) {
    console.log("Deleted");
    return null;
  }

  const body = await response.json();
  console.log(body);
  return body;
}

async function main() {
  // calling health
  let response = await fetch(`${BASE_URL}/health`);
  await show("GET /health", response);

  // creating a task
  response = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Finish lab5",
      course: "CS553",
      completed: false
    })
  });

  const createdTask = await show("POST /api/tasks", response);
  const taskId = createdTask.id;

  // listing all tasks
  response = await fetch(`${BASE_URL}/api/tasks`);
  await show("GET /api/tasks", response);

  // getting one task by id
  response = await fetch(`${BASE_URL}/api/tasks/${taskId}`);
  await show(`GET /api/tasks/${taskId}`, response);

  // updating a task
  response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      completed: true
    })
  });
  await show(`PATCH /api/tasks/${taskId}`, response);

  // deleting a task
  response = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: "DELETE"
  });
  await show(`DELETE /api/tasks/${taskId}`, response);
}

main().catch((error) => {
  console.error("Client request failed.");
  console.error("Make sure the API server is running on http://localhost:3000.");
  console.error(error.message);
});
