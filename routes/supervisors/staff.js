const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const employees = `SELECT emp.id, log.id AS login_id, emp.f_name, emp.l_name, log.email, log.password, rl.id AS role_id, dpt.id AS dpt_id, dpt.department_name, rl.roles,emp.expected_hrs FROM payroll3.employees emp JOIN payroll3.logins log ON log.emp_id = emp.id JOIN payroll3.departments dpt ON log.dpt_id = dpt.id JOIN payroll3.roles rl ON log.role_id = rl.id`;
  conn.query(employees, (err, eRows) => {
    if (err) throw err;
    res.render("employee/employee-list", {
      layout: "layouts/admin-layout",
      employees: eRows,
    });
  });
});

router.get("/form", (req, res) => {
  const roles = `SELECT * FROM roles`;
  const departments = `SELECT * FROM departments`;

  conn.query(roles, (err, rRows) => {
    if (err) throw err;
    conn.query(departments, (err, drows) => {
      if (err) throw err;
      res.render("employee/add-employee", {
        layout: "layouts/admin-layout",
        roles: rRows,
        departments: drows,
      });
    });
  });
});

router.post("/add", (req, res) => {
  const employeeData = {
    dpt_id: req.body.dpt_id,
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    expected_hrs: req.body.expected_hrs,
  };

  const employeeSql = `INSERT INTO employees SET ?`;
  conn.query(employeeSql, employeeData, (err, empRows) => {
    if (err) throw err;
    const loginData = {
      role_id: req.body.role_id,
      dpt_id: req.body.dpt_id,
      emp_id: empRows.insertId,
      email: req.body.email,
      password: req.body.password,
    };

    const loginsql = `INSERT INTO logins SET ?`;
    conn.query(loginsql, loginData, (err, logRows) => {
      if (err) throw err;
      res.redirect("/employees");
    });
  });
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const editSql = `SELECT emp.id, log.id as login_id, emp.f_name, emp.l_name, log.email, log.password, rl.id AS role_id, dpt.id AS dpt_id, dpt.department_name, rl.roles,emp.expected_hrs FROM payroll3.employees emp JOIN payroll3.logins log ON log.emp_id = emp.id JOIN payroll3.departments dpt ON log.dpt_id = dpt.id JOIN payroll3.roles rl ON log.role_id = rl.id WHERE emp.id = ${id}`;
  const roles = `SELECT * FROM roles`;
  const departments = `SELECT * FROM departments`;
  conn.query(editSql, (err, edRows) => {
    if (err) throw err;
    conn.query(departments, (err, dRows) => {
      if (err) throw err;
      conn.query(roles, (err, rows) => {
        if (err) throw err;
        res.render("employee/edit-employee", {
          layout: "layouts/admin-layout",
          edit: edRows[0],
          departments: dRows,
          roles: rows,
        });
      });
    });
  });
});

router.post("/update", (req, res) => {
  const updateEmp = `UPDATE employees SET dpt_id='${req.body.dpt_id}', f_name='${req.body.f_name}', l_name='${req.body.l_name}', expected_hrs='${req.body.expected_hrs}' WHERE id =${req.body.id}`;
  conn.query(updateEmp, (err, empRows) => {
    if (err) throw err;
    const bookingSql = `UPDATE logins SET role_id='${req.body.role_id}', dpt_id='${req.body.dpt_id}',  emp_id='${req.body.id}', email='${req.body.email}', password='${req.body.password}' WHERE id =${req.body.login_id}`;
    conn.query(bookingSql, (err, logRows) => {
      if (err) throw err;
      res.redirect("/employees");
    });
  });
});

router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const deleteQuery = `DELETE FROM employees WHERE id =${id}`;
  conn.query(deleteQuery, (err, rows) => {
    if (err) throw err;
    res.redirect("/employees");
  });
});

module.exports = router;