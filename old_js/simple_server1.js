
const http = require('http');

const server = http.createServer((req, res) => {
    //send response
    res.writeHead(200);
    res.end('Hello worls from the server');
})

server.listen(5000, 'localhost', () => {
    console.log('Server is listening at localhost on port 5000');
})
