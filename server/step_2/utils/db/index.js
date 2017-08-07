
const db = require('sqlite')


module.exports = async () => {
  await db.open('./db.sqlite');
  await db.migrate();
  return db;
} 