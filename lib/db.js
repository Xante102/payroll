const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "payroll3",
  dateStrings: true,
  multipleStatements: true,
});

conn.connect((err) => {
  if (!err) console.log("Connected to the database Successfully");
  else
    console.log(
      "Failed to connect to database" + JSON.stringify(err, undefined, 2)
    );
});

module.exports = conn;