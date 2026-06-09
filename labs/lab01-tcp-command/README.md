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

## Suggested Workflow

1. Run the server and client before changing anything.
2. Try the existing commands manually.
3. Run the automated tests.
4. Open `src/commands.js`.
5. Implement one command at a time.
6. Run `npm test` after each change.
7. Once the tests pass, test manually with the client.
8. Update this README to describe the final protocol.

## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between the client and the server?
2. Why does the server need to keep running after handling one request?
3. What happens if two clients connect at the same time?
4. How is this different from HTTP?

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
