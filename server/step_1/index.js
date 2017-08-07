const http = require('http');
const url = require('url');
const fs = require('fs');
const util = require('util');
const config = require('./config.js')
const path = require('path');


const port=8001
// promisify
const fsStat = util.promisify(fs.stat);

async function serverController(request, response) {
    try {
        let { staticFolder, fileName } = config;
        let filePath = path.join(staticFolder, fileName);
        let refer = request.headers.referer
        let stat;
        try {
            stat = await fsStat(filePath)
        } catch (e) {//ответ файл не найден
            response.writeHead(404, { "Content-Type": "text/html" });
            response.end("Файл не найден");
            return;
        }
        let urlParsed = url.parse(request.url, true);
        let query = urlParsed.query;
        let fileNameReq = query['filename'];
        let file = fs.readFile(filePath, 'binary');
        let setHeader = {
            'Content-Length': stat.size,
            'Content-Type': 'application/msword',
            'Set-Cookie' :'referrer=' + refer,
            'Content-Disposition':'attachment; filename=' + fileNameReq, 
        }
        response.setHeader(setHeader);
        var filestream = fs.createReadStream(filePath);
        filestream.pipe(response);
    } catch (e) {//ответ ошибка сервера
        response.writeHead(500, { "Content-Type": "text/html" });
        response.end("Ошибка сервера",500);
        return;
    }
};



var server = http.createServer(serverController);
server.listen(port,()=>{
    console.log(`соеденение открыто на http://localhost:${port}`)
});