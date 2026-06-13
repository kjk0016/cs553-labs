import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    // TODO: Validate that operation, a, and b are present.
    const required = ["operation", "a", "b"];
    const missingFields = required.filter(
        (field) => !(field in body)
    )
    if (missingFields.length > 0) {
        return {
            statusCode: 400,
            response: {
                error: "Missing required field or fields"
            }
        };
    }
    // TODO: Validate that a and b are numbers.
    if (typeof body.a !== "number" || typeof body.b !== "number") {
        return {
            statusCode: 400,
            response: {
                error: "a and b must be numbers"
            }
        };
    }
    // TODO: Support add, subtract, multiply, and divide.
    switch (body.operation) {
        case "add":
            return {
                statusCode: 200,
                response: {
                    result: body.a + body.b
                }
            };
        case "subtract":
            return {
                statusCode: 200,
                response: {
                    result: body.a - body.b
                }
            };
        case "multiply":
            return {
                statusCode: 200,
                response: {
                    result: body.a * body.b
                }
            };
        case "divide":
            // TODO: Return an error for division by zero.
            if (body.b == 0){
                return{
                    statusCode: 400,
                    response: {
                        error: "You cannot divide by zero"
                    }
                };
            }
            return {
                statusCode: 200,
                response: {
                    result: body.a / body.b
                }
            };
        case "exponent":
            return {
                statusCode: 200,
                response: {
                    result: body.a ** body.b
                }
            };
        // TODO: Return an error for unsupported operations.
        default:
            return {
                statusCode: 400,
                response: {
                    error: "Unsuported operation entered"
                }
            };

    }
}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (method === "GET" && url === "/requests") {
        // TODO: Return the current request count as JSON.
        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (method === "POST" && url === "/echo") {
        try {
            const body = await readJsonBody(req);

            // TODO: Return the parsed JSON body back to the client.
            sendJson(res, 200, body);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (method === "POST" && url === "/calculate") {
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}