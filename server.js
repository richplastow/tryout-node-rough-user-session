import { createHash } from 'crypto';
import http from 'http';

const roughUserSessions = {};

let logHealthCheckIfZero = 1;

// Start the server.
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

        // Get a nanosecond timestamp, before the rough-user-session section..
        const beforeRus = process.hrtime.bigint();

        // Gather headers which identify a browser set to a particular language.
        // Headers like "accept", are probably tied to "user-agent".
        const userAgent = req.headers['user-agent'] || ''; // eg "curl/7.79.1"
        const acceptLanguage = req.headers['accept-language'] || ''; // eg "en-GB,en;q=0.5"

        // Gather two potential sources of the client's IP address.
        const xForwardedFor = req.headers['x-forwarded-for'] || '';
        const socketRemoteAddress = req.socket.remoteAddress || '';

        // Combine the request's 'user-agent' and 'accept-language' headers with
        // the apparent IP addresses, and get a hash. This will often (but not
        // always) be the same for multiple requests from the same client.
        const roughUserSessionHash = createHash('md4').update(
            xForwardedFor +
            socketRemoteAddress +
            userAgent +
            acceptLanguage
        ).digest('base64');

        const r0 = roughUserSessionHash[0];
        const r1 = roughUserSessionHash[1];
        const r2 = roughUserSessionHash[2];
        const s0 = roughUserSessions[r0];
        if (s0) {
            const s1 = s0[r1];
            if (s1) {
                const s2 = s1[r2];
                if (s2) {
                    const afterRus = process.hrtime.bigint();
                    console.log(`${Number(afterRus-beforeRus)/1e6} ms (1)`);
                    return send200(res, `recognised: ${s2} | ${xForwardedFor} | ${socketRemoteAddress}`);
                } else {
                    s1[r2] = [ roughUserSessionHash ];
                }
            } else {
                s0[r1] = { [r2]: [ roughUserSessionHash ] };
            }
        } else {
            roughUserSessions[r0] = { [r1]: { [r2]: [ roughUserSessionHash ] } };
        }

        const afterRus = process.hrtime.bigint();
        console.log(`${Number(afterRus-beforeRus)/1e6} ms (2)`);
        return send200(res, `new session ${roughUserSessionHash} | ${xForwardedFor} | ${socketRemoteAddress}`);

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
