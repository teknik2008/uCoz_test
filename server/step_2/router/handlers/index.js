const Db = require('utils/db/index.js');
const crypto = require('crypto');
const mail = require('utils/mailer')

const util = require('util');


const cryptoPbkdf2 = util.promisify(crypto.pbkdf2);

let hashLength = 16;
let iterations = 10;


async function createSaltHash(email) {

    let salt = crypto.randomBytes(hashLength).toString('base64');
    let hash = (await cryptoPbkdf2(email, salt, iterations, hashLength, 'sha512')).toString();
    return { salt, hash }
};

async function checkSaltHash(email, salt, hash) {
    if (!email || !hash || !salt) return false;
    let userHash = (await cryptoPbkdf2(email, salt, iterations, hashLength, 'sha512')).toString();
    let check = userHash == hash;
    return check;
};


module.exports.addContact = async (ctx) => {
   
    let body = ctx.req.body;
    let { email, phone } = body;
    console.log(body)
    try {
        let { salt, hash } = await createSaltHash(email);
        let sql = `INSERT INTO Contacts (hash,salt,phone) VALUES(?,?,?);`;
        let db = await Db();
        await db.run(sql, [hash, salt, phone])
    } catch (e) {
        console.log(e)
    }

    ctx.redirect('/registr.html');
}


module.exports.recovery = async (ctx) => {
    let db = await Db();
    let body = ctx.req.body;
    let { phone, email } = body;
    let sql = 'select hash,salt,phone from Contacts where phone=?'
    let localData = await db.get(sql, phone);
    if (localData == void 0) {
        ctx.redirect('/not-data.html');
        return;
    };
    let { salt, hash } = localData;
    let check = await checkSaltHash(email, salt, hash);
    if (!check) {
        ctx.redirect('/not-data.html');
        return;
    }
    let text = 'Ваш номер телефона ' + phone;
    let from = "Супер сервис 👻<teknik2008@ya.ru>";
    let subject = "Служба востановления номеров";
    try {
        await mail({ text, from, subject, to: email });
    } catch (e) {
        throw new Error(e)
    }
    ctx.redirect('/recovery-ok.html');
} 