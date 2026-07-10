# Lab 3 REST API

## How to Run

Install the project dependencies from the `starter` directory:

```bash
npm install
```

Start the server:

```bash
npm run server
```

The server runs on:

```text
http://localhost:3000
```

The API stores items in memory, so the data resets each time the server restarts.

## How to Test

Run the automated tests from the `starter` directory:

```bash
npm test
```

The tests check the main API behavior, including the health route, item listing, item creation, item lookup by ID, item updates, item deletion, missing item errors, and invalid input errors.

- `GET /health` returns a successful health check response.
- `GET /items` returns the current list of items.
- `POST /items` creates a new item.
- `GET /items/:id` retrieves a specific item.
- `PUT /items/:id` updates an existing item.
- `DELETE /items/:id` removes an existing item.
- Missing items return status code `404`.
- Invalid `POST /items` and `PUT /items/:id` request bodies return status code `400`.

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/items` | Return all items |
| GET | `/items/:id` | Return one item |
| POST | `/items` | Create one item |
| PUT | `/items/:id` | Update one item |
| DELETE | `/items/:id` | Delete one item |

### Route Details

`GET /health` returns a health check response with status code `200`.

```json
{
  "status": "ok"
}
```

`GET /items` returns all items with status code `200`.

```json
[
  {
    "id": 1,
    "name": "keyboard",
    "quantity": 10
  },
  {
    "id": 2,
    "name": "mouse",
    "quantity": 5
  }
]
```

`GET /items/:id` returns one matching item with status code `200`. If the item does not exist, it returns status code `404`.

`POST /items` creates a new item with status code `201`. The request body must include `name` and `quantity`.

```json
{
  "name": "monitor",
  "quantity": 4
}
```

If the request body is invalid, `POST /items` returns status code `400` with a JSON error response.

`PUT /items/:id` updates an existing item with status code `200`. The request body must include both `name` and `quantity`.

```json
{
  "name": "mechanical keyboard",
  "quantity": 12
}
```

If the item does not exist, `PUT /items/:id` returns status code `404`. If the request body is invalid, it returns status code `400` with a JSON error response.

`DELETE /items/:id` deletes an existing item with status code `204`. A successful `204` response does not include a response body. If the item does not exist, it returns status code `404`.

## OpenAPI Documentation

The `openapi.yaml` file describes the API in a standard format. It documents the API title, version, local server URL, available routes, request bodies, response bodies, and error responses.

The OpenAPI file uses `/items/{id}` for routes with path parameters, while the Express server uses `/items/:id`. Both refer to the same route pattern, but OpenAPI and Express use different syntax.

The schemas in `openapi.yaml` describe the structure of successful item responses, item input request bodies, and JSON error responses.

## Reflection Answers

### 1. What makes this API more REST-like than the previous HTTP/JSON lab?

This lab is more REST-like than the previous HTTP/JSON lab, as it actually handles resources. In the previous lab, we used routes to perform calculations and echo messages. In this lab, we actually deal with resources with routes to query an item, create an item, update an item, and delete an item. All of these routes are resource interactions and not miscellaneous tasks.

### 2. What is the purpose of a route parameter such as `/items/:id`?

The purpose of a route parameter such as `/items/:id`, is just to allow the server to differentiate between items. It allows the client to send specific requests for an item, and the server to handle specific requests for an item.

### 3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

Post, put, and delete use different HTTP methods because they each describe a different interaction. POST to create a new item, PUT to update an item, and DELETE to remove an item. This clean separation makes the api easier to understand as the method describes the exact action being performed on a resource.

### 4. What is the difference between a `400` error and a `404` error?

A 400 error means a bad request was sent, and the server cannot understand it. This differs from a 404 error, in which the server understands the request but cannot find the specified resource. 

### 5. How does the OpenAPI file relate to your Express server code?

The openapi.yaml file just documents the API implemented in server.js. It details all of the routes, and methods used, with descriptions and expected responses. The express server code is the actuall implementation of the openapi specification.

## Graduate Extension

The graduate extension adds validation before creating or updating items.

For `POST /items` and `PUT /items/:id`, the server checks the JSON request body before saving any changes. The `name` field must be a string with at least one non-whitespace character, and the `quantity` field must be a number greater than or equal to zero.

If either field is missing or invalid, the server returns status code `400` with a JSON error response instead of creating or updating the item.

Automated tests were also added for invalid input. These tests verify that invalid POST /items and PUT /items/:id requests return status code 400 and include a JSON error message.
