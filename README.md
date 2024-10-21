
# Simple TCP Server with File Handling and HTTP Responses

This project is a simple TCP server implemented in Node.js that handles HTTP-like requests. It supports several functionalities, including:

- **Basic HTTP request handling** (responds with `200 OK` for root requests)
- **Echo functionality** (responds with the URL path after `/echo/`, with optional gzip compression)
- **File download** (supports GET requests for downloading files from a specified directory)
- **File upload** (supports POST requests for uploading files to a specified directory)
- **User-Agent display** (responds with the client's User-Agent string)
- **Error handling** (sends `404 Not Found` for unknown routes or missing files)

## Features

1. **Root Request (`/`)**: Returns a simple `200 OK` response.
2. **Echo (`/echo/`)**: Echoes back the content after `/echo/`. Supports gzip compression if requested.
3. **File Handling (`/files/`)**: 
   - **GET**: Fetches a file from a specified directory.
   - **POST**: Uploads a file to a specified directory.
4. **User-Agent (`/user-agent`)**: Returns the `User-Agent` of the requestor.
5. **404 Error**: Returns `404 Not Found` for unknown routes or if a file does not exist.

## Requirements

- Node.js (v12 or higher)
- `net` and `fs` built-in Node.js modules
- `zlib` module for gzip compression

## How to Run

1. **Clone the repository**:

   git clone https://github.com/vetoms/SimpleHTTPServer.git
   cd simple-tcp-server

##  Run the server:

node server.js <directory-path>
Replace <directory-path> with the path to the directory where you want to upload or download files.

## Test the server:

You can use curl or any HTTP client to interact with the server.

Example requests:

	1. **curl http://localhost:4221/
	2. **curl http://localhost:4221/echo/hello
	3. **curl http://localhost:4221/files/sample.txt
	4. **curl --data "File content" -X POST http://localhost:4221/files/new-file.txt
	5. **curl http://localhost:4221/user-agent

## Running Tests
This project includes unit tests using Mocha and Chai for testing the server's functionality.

Installing Test Dependencies
To run the tests, you need to install the necessary development dependencies:

npm install --save-dev mocha chai
Running the Tests
Before running the tests, make sure the server is running on localhost and port 4221. Open one terminal window and start the server:

node server.js <directory-path>
In a separate terminal window, run the test cases using Mocha:

npx mocha test.js
Test Cases
The following test cases are included in test.js:

## Root Request Test (/):

Verifies that the server responds with HTTP/1.1 200 OK for the root route.
Echo Route Test (/echo/):

Verifies that the server echoes back the content after /echo/ in the URL.
Gzip Echo Route Test (/echo/ with gzip):

Verifies that the server returns gzip-compressed content when Accept-Encoding: gzip is requested.
File Download Test (/files/):

Verifies that the server returns a file from the specified directory for GET requests.
File Upload Test (/files/ POST):

Verifies that the server allows uploading files to the specified directory using POST requests.
User-Agent Test (/user-agent):

Verifies that the server returns the correct User-Agent string from the request.
404 Error Test:

Verifies that the server returns a 404 Not Found response for unknown routes.

### Example Output
Running the tests will produce output like the following:

TCP Server Tests:  
1. **✓** should return 200 OK for root route  
2. **✓** should echo back the content after /echo/  
3. **✓** should return gzip compressed content if requested  
4. **✓** should return 404 for an unknown route  
5. **✓** should return the correct User-Agent header


## License
This project is licensed under the MIT License