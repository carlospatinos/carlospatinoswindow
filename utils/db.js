require('dotenv').config();
let DBConnection = require('mongoose');

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_url = process.env.DB_URL;

DBConnection.connect(`mongodb://${db_user}:${db_pass}@${db_url}`)
.then(() => console.log(`Connected to ${db_url}`))
.catch((err)=> console.log(err));

module.exports = { DBConnection }