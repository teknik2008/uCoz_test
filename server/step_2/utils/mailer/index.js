const config = require('config')
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport(config.smtp);

// console.log(transporter)
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Успешное соеденение по smtp, для отправки писем');
   }
});


module.exports = (mailOptions) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        })
    })
}