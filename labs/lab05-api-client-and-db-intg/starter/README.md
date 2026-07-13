# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes

## Graduate Extension

See response to question 5.

## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

The data moved from being saved as variables, during runtime, on the express server to actually being stored in a database. This move allows the data to be persistent, even when the server is no longer running. However, with that comes new logic for storing and retrieving the information stored in the database.

### 2. When should you use `PUT` instead of `PATCH`?

You use put when you want to completely replace an existing item. If you only need to update the item, or edit one of the fields, you use patch. However, to remove an existing item, and add a new one, all in one step you'd use put.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

The API still needs to validate non browser client specific inputs. Things like routes, request bodies, and other parameters need to be validated by the API, as clients might directly interface with the API through curl or some other tool. If validation techniques are only implemented on the browser client, and a user doesn't use the browser client, unexpected results will occur. 

### 4. How does the browser client help you test the API differently than `curl` alone?

The visual interface, that brower clients have, can make testing quicker and easier to understand. Instead of having to memorize and type out entire curl commands, you can interact with the browser client directly. 

### 5. If you added an extension, what did you add and why?

For the extension, categories that describe the items were added. For example, a keyboard and mouse falls under the I/O category, while a monitor falls under the display category. The API provides `GET /api/categories` for listing categories and `POST /api/categories` for creating them. The UI allows users to select a category when creating a new item. It also allows them to create a new category. I added this extension, as it was listed as an example extension and seemed like it would actually be useful to implement. The ability to add items under the same or different categories seemed like a nice touch.
