const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "chironess1",
  database: "sm_3",
});

module.exports = db;
