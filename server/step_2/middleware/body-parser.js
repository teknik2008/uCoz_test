function parseFormUrlencoded(bodyStr=''){
    let items=bodyStr.split('&');
    let body={}
    items.map(item=>{
        item=decodeURIComponent(item)
        let [key,value]=item.split('=');
        let itemObj={};
        body[key]=value;
    })
    return body;
}

function parseJson(bodyStr=''){
    try{
        return JSON.parse(bodyStr)
    }catch(e){
        // console.error(e)
        throw new Error('Не валидный json')
    } 
    
}

function parseData(req,bodyStr){
    let {headers={}}=req;
    let {'content-type':contentType}=headers;
    let body;
    if(contentType=='application/x-www-form-urlencoded'){
        body=parseFormUrlencoded(bodyStr);
    }else if(contentType=='application/json'){
        body=parseJson(bodyStr)
    }else{
        body=bodyStr;
    }
    return body
    
}

function bodyParser(req) {
    return new Promise((resolve, reject) => {
        var chunk = [];
        req.on('data', data =>{
            chunk.push (data);
        });
        req.on('end',  () => {
            let bodyStr=chunk.join('');
            let body=parseData(req,bodyStr)
            resolve(body);
        });
        req.on('error',(err)=>{
            reject(err)
        })
    })
}

module.exports=async (ctx) => {
    let method = ctx.method;
    if (method !== 'POST') return;
    let request = ctx.request;
    let body = await  bodyParser(request);
    ctx.req.body=body;
}

