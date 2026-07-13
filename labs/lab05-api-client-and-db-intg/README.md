# Lab 5 - API Client and Database Integration

## Starter Structure

The starter directory includes:

- `client/` for a plain browser client using `fetch`
- `src/server.js` for the Express API
- `docker-compose.yml` for Postgres
- `package.json` for the API and client scripts

The starter already implements:

- `GET /health`
- `GET /api/items`
- `POST /api/items`

The starter client can:

- load items
- submit a new item

The starter database setup:

- creates an `items` table
- seeds a few example rows when the table is empty

## Your Task

Use the starter as a base and extend it.

At minimum, implement the following additional routes:

| Method | Route | Description |
|---|---|---|
| GET | `/api/items/:id` | Return one item by ID |
| PUT | `/api/items/:id` | Replace one item |
| PATCH | `/api/items/:id` | Partially update one item |
| DELETE | `/api/items/:id` | Delete one item |

Your implementation should:

- validate route parameters and request bodies
- return JSON responses
- use reasonable status codes
- return a `404` response when an item does not exist
- distinguish between invalid input and missing resources
- continue using Postgres as the source of truth

## UI Implementation

The browser client includes buttons and forms that demonstrate the following
API routes:

| UI control | Method and route | Behavior |
|---|---|---|
| Load Items | `GET /api/items` | Retrieves the current items from Postgres and displays them. |
| Add Item | `POST /api/items` | Creates an item using the entered name, quantity, and category. |
| Edit | `PATCH /api/items/:id` | Partially updates an existing item's name, quantity, or both. |
| Delete | `DELETE /api/items/:id` | Deletes the selected item and refreshes the displayed list. |
| Add Category | `POST /api/categories` | Creates a category and adds it to the category selection list. |

The `GET /api/items/:id` and `PUT /api/items/:id` routes are implemented, they just don't have corresponding buttons.

## Graduate Extension

For the extension, categories that describe the items were added. For example, a keyboard and mouse falls under the I/O category, while a monitor falls under the display category. The API provides `GET /api/categories` for listing categories and `POST /api/categories` for creating them. The UI allows users to select a category when creating a new item. It also allows them to create a new category.


## Running the Starter

Move into the starter directory:

```bash
cd labs/lab05-api-client-and-db-intg/starter
```

Install dependencies:

```bash
npm install
```

Start Postgres:

```bash
docker compose up -d
```

Run the API:

```bash
npm run api
```

Run the browser client in a second terminal:

```bash
npm run client
```

Open:

```text
http://localhost:5173
```

The API runs on:

```text
http://localhost:3000
```

The starter Postgres container is exposed on host port `5433`, so it is less
likely to conflict with another local Postgres instance already using `5432`.

## Deliverables

Submit your completed starter directory with:

- your implemented API routes
- your updated client code
- any schema or SQL changes you made
- your reflection answers in the starter `README.md`

## Reflection Prompts

Answer these in `starter/README.md`:

1. What changed when the API moved from in-memory data to Postgres?
2. When should you use `PUT` instead of `PATCH`?
3. What kinds of validation belong in the API even if the browser client also validates input?
4. How does the browser client help you test the API differently than `curl` alone?
5. If you added an extension, what did you add and why?
