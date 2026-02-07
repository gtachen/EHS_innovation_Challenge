const net = require('net');
const os = require('os');
const logging = console; // Basic logging replacement

// Configuration
const PORT = 2327;
const FORMAT = 'utf-8';
const HOST = '0.0.0.0'; // Or use getNetworkIP() for specific local IP
let data = ["baseballbat", "ladder"];

/**
 * Extracts content from the HTTP body
 * Matches your Python logic: input[input.find("\r\n\r\n")+4 : +20]
 */
function getContent(input) {
    const headerEnd = input.indexOf("\r\n\r\n");
    if (headerEnd === -1) return "";
    return input.substring(headerEnd + 4, headerEnd + 20).trim();
}

const server = net.createServer((conn) => {
    const addr = `${conn.remoteAddress}:${conn.remotePort}`;
    logging.info(`- CONNECTED TO: ${addr}`);

    conn.on('data', (buffer) => {
        const msg = buffer.toString(FORMAT);
        logging.info(`- ${addr} SAYS: "${msg.substring(0, 50)}..."`); // Truncated log

        const method = msg.substring(0, 4).trim();

        if (method === "GET") {
            const body = data.join("");
            const response = 
                `HTTP/1.1 200 OK\r\n` +
                `Content-Type: text/html\r\n` +
                `Content-Length: ${Buffer.byteLength(body)}\r\n` +
                `Access-Control-Allow-Origin: *\r\n` + // Added for GUI compatibility
                `Connection: close\r\n\r\n` +
                `${body}`;

            conn.write(response);
            logging.info(`- PAGE SERVED TO ${addr}`);
            conn.end();

        } else if (method === "POST") {
            const bodyContent = getContent(msg);
            logging.warn(`---- INFO POSTED: ${bodyContent}`);

            if (bodyContent.startsWith("add")) {
                // Equivalent to data.append(content[4:20])
                const newItem = bodyContent.substring(4, 20);
                data.push(newItem);
            }

            if (bodyContent.startsWith("take")) {
                const requestName = bodyContent.substring(5, 20);
                data = data.filter(item => {
                    const name = item.split(":")[0];
                    return name !== requestName;
                });
            }

            console.log("Current Data:", data);
            
            // Send back a basic OK for POST
            conn.write("HTTP/1.1 200 OK\r\nConnection: close\r\n\r\n");
            conn.end();
        }
    });

    conn.on('error', (err) => {
        logging.error(`Connection error: ${err.message}`);
    });
});

server.listen(PORT, HOST, () => {
    console.clear();
    logging.info(`- LISTENING ON: ${HOST}:${PORT}`);
});

// Helper to track active connections (replaces interactions counter)
let interactions = 0;
server.on('connection', () => {
    interactions++;
    logging.info(`- INTERACTIONS: ${interactions}`);
});
