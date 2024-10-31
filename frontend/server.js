const http = require('http');
const fs = require('fs');
const path = require('path');


// Define the port to listen on
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'home.html' : req.url);
    let contentType = 'text/html';

    if (req.url.endsWith('.css')) {
        filePath = path.join(__dirname, 'public', req.url);
        contentType = 'text/css';
    } else if (req.url.endsWith('.js')) {
        filePath = path.join(__dirname, 'public', req.url);
        contentType = 'application/javascript';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

// Start the server
server.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    const open = await import('open');
    open.default(`http://localhost:${PORT}`);
});
