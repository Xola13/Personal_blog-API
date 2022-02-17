const mysql = require("mysql")

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "8-2fermENt2020",
    database: "Personal_blog"
  });

  module.exports = con;