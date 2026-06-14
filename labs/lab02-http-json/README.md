# Lab 2 - Hello HTTP + JSON

Graduate portion: I added an extra calculation command `exponent`.

Operations

| Operation  | Meaning                 |
| ---------- | ----------------------- |
| `add`      | Add `a` and `b`         |
| `subtract` | Subtract `b` from `a`   |
| `multiply` | Multiply `a` and `b`    |
| `divide`   | Divide `a` by `b`       |
| `exponent` | `a` to the power of `b` |     |


| Status Code | Meaning               |
| ----------- | --------------------- |
| `200`       | OK                    |
| `400`       | Bad request           |
| `404`       | Not found             |
| `405`       | Method not allowed    |
| `500`       | Internal server error |


The tests should check behavior such as:

* `GET /health` returns a JSON status response.
* `POST /echo` returns the submitted JSON data.
* `POST /calculate` performs supported calculations.
* Unknown routes return an error.
* Invalid JSON returns an error.
* The server does not crash on bad input.

## Reflection Questions

Answer the following questions in your submission:

1) What is the difference between a TCP message and an HTTP request?
A tcp message runs on the transport layer, while an http request runs on the application layer. Tcp is responsible for establishing the connection between the client and the server, while http provides a standard format between the client(web) and the server. 

2) What does the `Content-Type: application/json` header tell the server?
This just teels the server that the body of the http request follows json formatting. This is important so that the server knows how to read the incoming request. 

3) Why should a server return different HTTP status codes for different situations?
Servers should return different http status codes for different situations to provide more robust feedback. If I, as a client, send something that results in an error, it is much easier to rectify that error if I know exactly what went wrong. If instead, I'm just given a general error, it'll likely take me way longer to figure out what's going wrong. This is also true for success codes. You may not only want to know that a request was successfully recieved, but also know that some other task was successful as well. 

4) What happens if the client sends invalid JSON?
If the client sends and invalid JSON, the server sends an error response stating that it recieved an invalid JSON.

5) How is this lab different from Lab 1?
This lab differs from lab 1, as we are no longer using a custom command protocol. Instead, in this lab, we're using http as a standard format. Lab 1 just focused on basic socket communication, in which we implemented our own commands such as echo and upper. In this lab we build upon that by using http routes, methods, headers, status codes, and requests. Instead of parsing our custom commands, the server parsers the structured http data. 

## Submission

Submit your completed lab according to the course submission instructions.

Your submission should include:

* Your updated source code.
* Your completed HTTP JSON server.
* Your updated README if you changed or extended the API.
* Your answers to the reflection questions.
* Any graduate extension work, if applicable.
