const express = require("express");
const router = express.Router();
const conn = require("../lib/db");

router.get("/", (req, res) => {
  res.render("login", {});
});

router.post("/auth", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  console.log(password);

  conn.query(
    `SELECT * FROM payroll3.logins WHERE email ='${email}' AND BINARY password='${password}'`,
    (err, rows) => {
      if (err) throw err;
      if (!err) {
        if (rows.length > 0) {
          req.session.loggedIn = true;
          req.session.dpt_id = rows[0].dpt_id;
          req.session.role_id = rows[0].role_id;
          req.session.emp_id = rows[0].emp_id;
          console.log(rows[0].role_id);
          console.log(rows[0].dpt_id);

          if (rows[0].role_id == 1) {
            res.redirect("/admin");
          } else if (rows[0].role_id == 2) {
            res.redirect("/salaryInfo");
          } else if (rows[0].role_id == 3 || rows[0].dpt_id == 4) {
            res.redirect("/salarytable");
          } else if (rows[0].role_id == 4) {
            res.redirect("/empsalary");
          } else {
            res.redirect("/");
          }
        } else {
          req.session.loggedIn = false;
          res.redirect("/");
        }
      }
    }
  );
});

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;