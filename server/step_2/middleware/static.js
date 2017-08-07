const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const util = require('util');

const fsStat = util.promisify(fs.stat);
const dir = 'public'

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

async function static(ctx) {
    if (ctx.method !== 'GET' || ctx.body !== null) return;
    let { request, body } = ctx;
    const parsedUrl = url.parse(request.url);
    let pathname = path.join('.',dir||'', parsedUrl.pathname);
    
    let stat;
    try {
        stat = await fsStat(pathname);
        if (stat.isDirectory()) {
            pathname += '/index.html';
        }
        stat = await fsStat(pathname);
        const parseFile = path.parse(pathname);
        let ext=parseFile.ext
        
        let setHeader = {
            'Content-Length': stat.size,
            'Content-Type':  mimeType[ext] || 'text/plain',
            'Content-Disposition':' filename=' +parseFile.base, 
        }
        for(let key in setHeader){
            ctx.setHeader(key,setHeader[key]);
        }
        
        ctx.body = fs.createReadStream(pathname);
    } catch (e) {
       console.log(e)
        ctx.statusCode = 404;
        return;
    };
}



module.exports = static;
