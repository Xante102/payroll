const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const absents = `SELECT 
    emp.id AS emp_id,
    emp.f_name,
    emp.l_name,
    dpt.id AS dpt_id,
    dpt.department_name,
    pc.id AS paycycle_id,
    pc.date_from,
    pc.date_to,
    pc.status,
    hrs.id AS hrs_id,
    hrs.hrs,
    hrs.ovt_hrs,
    st.id AS salary_id,
    st.salary,
    st.overtime,
    st.total_salary,
    ab.absent_dt
  FROM
    payroll3.employees emp
  JOIN
  payroll3.absents ab on emp.id = ab.emp_id
  JOIN
     payroll3.departments dpt on dpt.id = emp.dpt_id
  JOIN
     payroll3.hours hrs on emp.id = hrs.emp_id
  JOIN
     payroll3.salaries st on st.hrs_id = hrs.id
  JOIN
    payroll3.paycycles pc on pc.id = st.paycycle_id
    `;
  const employees = `SELECT * FROM employees`;
  conn.query(absents, (err, abresults) => {
    if (err) throw err;
    conn.query(employees, (err, empresults) => {
      if (err) throw err;
      res.render("employees/absent-days", {
        layout: "layouts/supervisor-layout",
        employees: empresults,
        absents: abresults,
      });
    });
  });
});

router.post("/add", (req, res) => {
  const absentData = {
    emp_id: req.body.emp_id,
    absent_dt: req.body.absent_dt,
  };

  const absentQuery = `INSERT INTO absents SET ?`;

  conn.query(absentQuery, absentData, (err, result) => {
    if (err) throw err;
    res.redirect("/preview");
  });
});

module.exports = router;