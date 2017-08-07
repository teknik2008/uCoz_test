
let smtp = {
    // "domains": [
    //     "yandex.ru"
    // ],
    // pool: true,
    host: 'smtp.zoho.eu',
    port: 465,
    // secure: false,
    auth: {
        user: 'Teknik2008@ya.ru',
        pass: '1qaz2wsx'
    }
} 

let server ={
    port:8002
}
 

 
module.exports = {
    smtp, 
    server
}