# Kevin King CS-553 Midterm

## Midterm answers

For answers to the midterm questions check out `answers.md`.

## Running the Express Server

Move into the midterm directory:

```bash
cd midterm
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node src/server.js
```

The server listens on port `3000` by default.

## Automatic testing with the client

After starting the server, open a second terminal and move into the midterm directory:

```bash
cd midterm
```

Run the client script:

```bash
node client.js
```

The client demonstrates all the requirements in part 5. This includes:

- calling `/health`
- creating a task
- listing all tasks
- getting one task by id
- updating a task
- deleting a task

## Testing with curl

After starting the server, test the health route:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

List all tasks:

```bash
curl http://localhost:3000/api/tasks
```

Get one task by id:

```bash
curl http://localhost:3000/api/tasks/1
```

Create a task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish lab5","course":"CS553","completed":false}'
```

Replace a task:

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish the midterm","course":"CS553","completed":false}'
```

Update part of a task:

```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Delete a task:

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```
