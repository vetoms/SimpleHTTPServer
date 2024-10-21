const net = require("net");
const fs = require("fs");
const zlib = require("zlib");

console.log("Logs from your program will appear here!");

// Create a TCP server
const server = net.createServer((socket) => {

    // Handle socket 'close' event
    socket.on("close", () => {
        socket.end(); // Ensure socket is closed
    });

    // Handle incoming data on the socket
    socket.on("data", (data) => {
        console.log(data); // Log the raw incoming data
        const request = data.toString(); // Convert data buffer to string
        const headers = request.split('\r\n'); // Split request into headers
        const url = request.split(' ')[1]; // Extract URL from request
        const method = request.split(' ')[0]; // Extract method (GET, POST, etc.)

        // Handle root URL request ("/")
        if (url === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n"); // Send a 200 OK response
        }
        
        // Handle echo functionality ("/echo/")
        else if (url.includes("/echo/")) {
            const content = url.split('/echo/')[1]; // Extract echo content from URL

            // If request supports gzip compression
            if (request.includes("gzip")) {
                const body = zlib.gzipSync(content); // Compress content using gzip
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Encoding: gzip\r\nContent-Length: ${Buffer.byteLength(body)}\r\n\r\n`);
                socket.write(body); // Send compressed content
            } else {
                // Send plain text response if no gzip
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
            }
        }

        // Handle file download request (GET method)
        else if (url.startsWith("/files/") && method === "GET") {
            const directory = process.argv[3]; // Directory passed as argument
            const filename = url.split("/files/")[1]; // Extract filename from URL
            const filepath = `${directory}/${filename}`;

            if (fs.existsSync(filepath)) {
                const content = fs.readFileSync(filepath).toString(); // Read file content
                const response = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
                socket.write(response); // Send file content as response
            } else {
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n"); // File not found response
            }
        }

        // Handle file upload request (POST method)
        else if (url.startsWith("/files/") && method === "POST") {
            const filename = process.argv[3] + "/" + url.substring(7); // Build the file path
            const req = data.toString().split("\r\n"); // Parse request body
            const body = req[req.length - 1]; // Extract body content (file content)

            fs.writeFileSync(filename, body); // Write file to disk
            socket.write("HTTP/1.1 201 Created\r\n\r\n"); // Send 201 Created response
        }

        // Handle User-Agent header request ("/user-agent")
        else if (url === "/user-agent") {
            const userAgent = headers.find(header => header.startsWith("User-Agent:")).split('User-Agent: ')[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`); // Send User-Agent info
        }

        // Handle unknown routes with 404 response
        else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n"); // Send 404 Not Found
        }
    });
});

// Start listening on port 4221 on localhost
server.listen(4221, "localhost");