const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const agrregate = `SELECT count(emp.id) AS emp_count FROM payroll3.employees emp;
                   SELECT count(dpt.id) AS dep_count FROM payroll3.departments dpt;
                   SELECT count(log.id) AS log_count FROM payroll3.logins log;
                   SELECT sum(st.total_salary) AS salary_sum FROM payroll3.salaries st;`;

  const employees = `SELECT emp.f_name, emp.l_name, dpt.department_name FROM payroll3.employees emp JOIN payroll3.departments dpt ON dpt.id = emp.dpt_id`;
  const departments = `SELECT * FROM departments`;
  const users = `SELECT emp.f_name, emp.l_name, log.email, log.password FROM  payroll3.roles rl JOIN payroll3.logins log ON rl.id = log.role_id JOIN payroll3.employees emp on emp.id = log.emp_id`;
  conn.query(employees, (err, eRows) => {
    if (err) throw err;
    conn.query(agrregate, (err, aRows) => {
      if (err) throw err;
      conn.query(departments, (err, dRows) => {
        if (err) throw err;
        conn.query(users, (err, uRows) => {
          if (err) throw err;
          res.render("admin/dashboard", {
            layout: "layouts/admin-layout",
            employees: eRows,
            departments: dRows,
            users: uRows,
            aggregate: aRows,
          });
          console.log(aRows);
        });
      });
    });
  });
});

module.exports = router;