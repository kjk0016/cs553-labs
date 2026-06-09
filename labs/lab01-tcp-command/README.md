# Lab 1 - TCP Command Server
## Command Protocol

The server accepts one text command per line.

Commands are case-insensitive, but the command arguments should be handled as normal text.

| Client sends    | Server responds     |
| --------------- | ------------------- |
| `ECHO hello`    | `hello`             |
| `UPPER hello`   | `HELLO`             |
| `LOWER HELLO`   | `hello`             |
| `REVERSE hello` | `olleh`             |
| `QUIT`          | closes connection   |
| unknown command | error message       |
| Empty command   | No response         |

## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between the client and the server?

The difference between the client and the server is that a client requests a service, while a server provides a service. The client will make a request, and it is up to the server to know how to handle the request. Another difference is that the client is the one that initiates communication between the two.

2. Why does the server need to keep running after handling one request?

The server needs to keep running after handling one request, as the same client, or others, may immediately make another request. In order to be able to handle these requests, the server must stay up. An alternative of restarting the server after every request would be highly inefficient.

3. What happens if two clients connect at the same time?

If two clients connect at the same time, they will still both be serviced by the server. Each client has its own connection to the server and thus is still able to send commands that will be handled by the server. With such a small number of clients connected at the same time, the users likely wouldn't even notice that they weren't the only ones connected to the server.

4. How is this different from HTTP?

This raw socket approach is different from HTTP, as HTTP provides structure to the messages. While the underlying protocol is TCP for both, HTTP provides a standard format for all messages and responses to follow. The HTTP protocol is also more complex, as it allows data to be read, created, replaced, deleted, and more. This simple protocol can only echo or simply modify the byte stream the client sends.

## Submission

Submit your completed lab according to the course submission instructions.

Your submission should include:

* Your updated source code.
* Your completed `commands.js`.
* Your updated README protocol description.
* Your answers to the reflection questions.
* Any graduate extension work, if applicable.

Before submitting, verify that:

```
npm test
```

runs successfully.
