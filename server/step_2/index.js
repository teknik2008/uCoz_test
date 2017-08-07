const http = require('http');
const App =require('./app/index.js');
const app=new App();
const router=require('./router')
const static=require('./middleware/static.js');
const bodyParser =require('./middleware/body-parser.js')
const {server:serverConf} = require('./config')

app.use(bodyParser)
app.use(router.routes)

app.use(static)

var server = http.createServer(app.hendler.bind(app));
server.listen(serverConf.port,()=>{
    console.log(`соеденение открыто на http://localhost:${serverConf.port}`)
});
