const http = require('http');
const fs = require('fs');
const path = require('path')
const pathToIndex = path.join(__dirname, 'static', 'index.html');
const pathToStyle = path.join(__dirname, 'static', 'style.css')
const pathToScript = path.join(__dirname, 'static', 'script.js')
const indexHtmlFile = fs.readFileSync(pathToIndex)
const server = http.createServer((req,res) => {
    switch(req.url){
        case('/'):
            res.end(indexHtmlFile);
            break
        default:
            res.statusCode = 404;
            res.end('Error 404')
            break

    }
        
})
server.listen(3000);