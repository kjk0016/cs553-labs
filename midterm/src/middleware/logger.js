export function logEntry(req, res, next){
    // get current time
    const start = Date.now();

    // when task finishes get current time
    res.on("finish", () => {
        const end = Date.now() - start;
        // log the method, path, status code, and total time in ms
        console.log(req.method, req.path, res.statusCode, end);
    });

    next();
}