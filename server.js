import http from 'http';

let logHealthCheckIfZero = 1;
server();

/**
 * Creates a simple server, to can roughly (and quickly) infer user sessions.
 * 
 * @return {void}
 *     Does not return anything
 */
function server() {

    // Create and start the server.
    http.createServer((req, res) => {

        // Deal with a health check request. If health checks are performed
        // every 20 seconds, only log once a day.
        if (req.url === '/') {
            logHealthCheckIfZero -= 1;
            if (!logHealthCheckIfZero) {
                logHealthCheckIfZero = 3 * 60 * 24;
                return send200(res, 'ok!');
            } else {
                return send200(res, 'ok!', false);
            }
        }

        // Any other request is a 400.
        send400(res, 'oops!');

    }).listen(
        process.env.PORT || 1234,
        '0.0.0.0',
        () => console.log(`👉 http://0.0.0.0:${process.env.PORT || 1234}/`),
    );
}


/* ----------------------------- Private Helpers ---------------------------- */

// Responds to a request with a 200 success, and a plain text message.
function send200(res, msg, doLog=true) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    res.end(msg);
    if (doLog) console.log('200:', msg);
}

// Responds to a request with a 400 error, and a plain text message.
function send400(res, err) {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 400;
    res.end(err.message || err);
    console.error('400:', err.message || err);
}
