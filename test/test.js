const net = require('net');
const chai = require('chai');
const expect = chai.expect;

// Helper function to send and receive data from the server
const sendRequest = (request) => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let response = '';
        
        client.connect(4221, 'localhost', () => {
            client.write(request);
        });

        client.on('data', (data) => {
            response += data.toString();
        });

        client.on('end', () => {
            resolve(response);
        });

        client.on('error', (err) => {
            reject(err);
        });
    });
};

describe('TCP Server Tests', () => {

    // Test root route "/"
    it('should return 200 OK for root route', async () => {
        const request = `GET / HTTP/1.1\r\n\r\n`;
        const response = await sendRequest(request);
        expect(response).to.include('HTTP/1.1 200 OK');
    });

    // Test echo functionality
    it('should echo back the content after /echo/', async () => {
        const request = `GET /echo/hello HTTP/1.1\r\n\r\n`;
        const response = await sendRequest(request);
        expect(response).to.include('HTTP/1.1 200 OK');
        expect(response).to.include('hello');
    });

    // Test gzip compression in echo
    it('should return gzip compressed content if requested', async () => {
        const request = `GET /echo/hello HTTP/1.1\r\nAccept-Encoding: gzip\r\n\r\n`;
        const response = await sendRequest(request);
        expect(response).to.include('HTTP/1.1 200 OK');
        expect(response).to.include('Content-Encoding: gzip');
    });

    // Test 404 error for non-existent route
    it('should return 404 for an unknown route', async () => {
        const request = `GET /unknown HTTP/1.1\r\n\r\n`;
        const response = await sendRequest(request);
        expect(response).to.include('HTTP/1.1 404 Not Found');
    });

    // Test User-Agent header
    it('should return the correct User-Agent header', async () => {
        const request = `GET /user-agent HTTP/1.1\r\nUser-Agent: TestAgent\r\n\r\n`;
        const response = await sendRequest(request);
        expect(response).to.include('HTTP/1.1 200 OK');
        expect(response).to.include('TestAgent');
    });
});
