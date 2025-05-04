const http = require('http');
const fs = require('fs');
const path = require('path')
const db = require('./database');
const { Script } = require('vm');
const pathToRegister = path.join(__dirname, 'static', 'register.html')
const pathToLogin = path.join(__dirname, 'static', "login.html" )
const pathToIndex = path.join(__dirname, 'static', 'index.html');
const pathToStyle = path.join(__dirname, 'static', 'style.css')
const pathToScript = path.join(__dirname, 'static', 'script.js')
const indexHtmlFile = fs.readFileSync(pathToIndex)
const registerHtmlFile = fs.readFileSync(pathToRegister)
const loginHtmlFile = fs.readFileSync(pathToLogin)

const server = http.createServer((req,res) => {
let data = '';
req.on('data', function(chunk){
    data += chunk;
});
req.on('end', function(){
    console.log(data);
    return res.end()
});
    switch(req.url){
        case('/1'):
            res.end(indexHtmlFile);
            break
        case('/register'):
            res.end(registerHtmlFile)
            break
        case('/login'):
            try{
                const user = JSON.parse(data);
                const token = await db.getAuthToken(user);
                validAuthTokens.push(token)
                res.writeHead(200);
                res.end(token);
            }
            catch(e){
                res.writeHead(500);
                return res.end('error: ' + e)
            }
            res.end(loginHtmlFile)
            break
        default:
            res.statusCode = 404;
            res.end('Error 404')
            break
        
    }
    let message = db.getMessages();
    db.addMessage(message, 1);
})
function guarded(req, res){
    const credentionals = getCredentionals(req.headers?.cookie);
    if(!credentionals){
        res.writeHead(302, {'Location': '/register'});
    }
    if(req.method === 'GET'){
        switch(req.url) {
            case '/': return res.end(indexHtmlFile);
            case '/script.js': return res.end(scriptFile)
        }
    }
    res.writeHead(404);
    return res.end('Error 404')
}
function getCredentionals(req) {
    const cookies = cookie.parse(req.headers?.cookie || '');
    const token = cookies?.token;
    if(!token || !validAuthTokens.includes(token)) return null;
    const [user_id, login] = token.split('.');
    if(!user_id || !login) return null;
    return {user_id, login};
  }
  
io.use((socket, next) => {
    const cookie = socket.handshake.auth.cookie;
    const credentionals = getCredentionals(cookie);
    if(!credentionals){
        next(new Error("no auth"));
    }
});
server.listen(3000);