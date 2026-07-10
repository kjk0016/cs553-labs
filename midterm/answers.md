# Part 1 — Conceptual Foundations

1. Sockets vs. HTTP
Explain the difference between a raw TCP socket server and an HTTP server. Your answer should include:

The difference between a raw TCP socket server and an HTTP server is that the requests sent to an HTTP server follow a specific predefined structure, while a raw TCP socket server sends and receives bytes without enforcing a message format. A socket provides an endpoint for network communication, usually identified by and IP address and port. The socket provides the low level foundation for other protocols to build upon, and handles the sending and receiving of bytes over a TCP connection. It does not define how those bytes should be interpreted, though. HTTP builds upon this by defining standardized request and response messages. It specifies the format of requests and responses, including things such as methods and status codes. This addition, allows clients and servers to communicate with each other, using a common protocol. Most web APIs don't directly expose raw socket protocols because the clients would need to understand the custom protocol implemented by the server. Instead, it is netter to use a standard and well known protocol, such as HTTP, to make development and maintainance much easier. 

2. Request/Response
Describe the request/response pattern.

The request/response pattern is a simple pattern in which a client sends a request, the server processes the request, and then the server sends a response.
For a TCP command server, this appears when the client connects to the server through a socket and sends bytes. The server reads those bytes, interprets the command based on its own protocol, performs the relevant action, and then writes bytes back as the response.
For an HTTP API, the pattern is more structured. The client sends an HTTP request with a method, path, headers, and optional body. The server processes that request and sends back an HTTP response with a status line, headers, and optional body. HTTP builds on TCP by adding a standard request and response message format.
For an Express route handler, the pattern appears as objects within the code. In Express, the HTTP request is received and passed into a route handler as a req object. The route handler reads the relevant information from the request, performs any necessary tasks, and then uses the res object to send a response.

3. Statelessness
Explain what it means for an API to be stateless. Give one advantage and one disadvantage of stateless design.

A stateless API is an api in which each request contains everything the server needs to understand and process the request. In addition to that, the server does not remember any prior requests. An advantage for this design, is that it is easier to scale horizontally. Since the server does not store any client specific session information, any server can handle any request. A disadvantage to this approach, is an increased message size, as each request has to contain everything needed. 

4. HTTP status Codes
| Example                                         | code|
|----|----|
|A new resource was successfully created          | 201 |
|The client requested an item that does not exist | 404 |
|The client sent JSON missing a required field    | 400 |
|The server had an unexpected error               | 500 |
|A successful request returns JSON data           | 200 |

# PART 2

You are designing an API for a small Course Task Tracker. The API manages tasks for a class.
List URIs for:
getting all tasks,
getting one task by id,
creating a task,
replacing a task,
partially updating a task,
deleting a task.


| Task                     | Method   | URI          | idempotent or safe |
|---|---|---|---|
| getting all tasks        |   get    |  /tasks      | Both as it does not change the server state to retrieve the tasks, and repeating the request leaves the server in the same state. |
| getting one task by id   |   get    |  /tasks/:id  | Both as it does not change the server state to retrieve the tasks, and repeating the request leaves the server in the same state. |
| creating a task          |   post   |  /tasks      | Neither. It changes the server state, but repeating the same request does not have the exact same effect. Instead multiple tasks will be created.
| replacing a task         |   put    |  /tasks/:id  | Idempotent as it changes the server state, and repeating the request will leave the server in the same state |
| partially updating a task|   patch  |  /tasks/:id  | Not safe, and usually not idempotent. Depending on how the patch is defined sometimes repeating the same request can leave the server in the same state. However, if the patch is something like an incremental update, repeating the task will lead to a different server state. In both cases it isn't safe as it changes the server state. |
| deleting a task          |   delete |  /tasks/:id  | Idempotent as it changes the server state, and repeating the request will leave the server in the same state. |

```json
{
    "title": "Complete the midterm",
    "course": "CS553",
    "completed": false
}
```

# Part 3 — Express API Implementation

See the code in `server.js` and `tasks.js`.

# Part 4 — Middleware

These are middleware concerns as the same logic applies for many of the different routes. Instead of copying and pasting the same code, over and over again, it is much better to have the code in one central spot that can be called when needed. This makes the code significantly easiear to read and maintain. It also makes future updates significantly more efficient, as the update only needs to be applied in one places versus multiple places.

# Part 5 — Basic Client

See the code in `client.js`.

# Part 6 — OpenAPI Specification

See the `OpenAPI.yaml` file.

# Part 7 - Reflection

1. Code vs. Contract
Explain the difference between an Express route implementation and an OpenAPI specification.

The difference between an Express route implementation and an OpenAPI specification is that one is the actual code implementation and the other is documentation on the implementation. An OpenAPI specification lists a server's endpoints, the methods associated with those endpoints, the expected request data, as well as expected responses. This is done so that users know what the server provides, and how to interact with it. The Express route implementation is the actual code running the server, so it's responsible for applying the server logic. 

2. Drift
Give two examples of how code and OpenAPI documentation can drift apart.

- Developers may decide to add or remove a route. They might update the code, and test their changes while forgetting to actually update the documentation.

- Developers may decide to change the expected request body format. They may decide to add or remove a field, but forget to update those changes in the documentation.

3. Client Impact
Explain why inaccurate API documentation can cause problems for client developers.

Inaccurate API documentation can cause problems for client developers as they can make implementation decisiones based on incorrect documentation. A developer may follow the documentation of an expected route, request format, or expected status code, only to realize at runtime that the server does not behave as expected. This can lead to unnecessary debugging and wated time that could be avoided by maintaining accurate and up to date documents. 

# Part 8 Graduate

## Option B — Contract-First Design
Explain the advantages and disadvantages of designing the OpenAPI specification before writing the Express
code.

Your answer should discuss team communication, testing, client development, and the risk of implementation
drift.

Designing the OpenAPI specification before writing the Express code has several advantages and disadvantages, as discussed in my responses to Questions 2 and 3 in Part 7 above. Creating accurate documentation first allows developers to review the entire implementation plan before any code is written. This gives team members the opportunity to raise concerns, or identify any issues that team members may have missed. This also allows team members to develop a strong understanding of the scope of the project before implementation begins. It is also useful for testing, as test cases can be written before the api is fully implemented. Since developers already knows what the expected routes, requests, and responses will be, they don't have to wait for each route to be implemented before writing tests.

However, there are disadvantages as well. One major issue is that designs often change during implementation. An assumption may turn out to be incorrect, or an important problem may have been overlooked. As a result, the actual implementation may diverge from the original design. When this happens, the OpenAPI specification must be updated to remain accurate. If the implementation changes but the documentation does not, drift occurs. This is problamatic as drift is a headache for clients and developers alike.
