const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const empQuery = `SELECT * FROM employees`;
  conn.query(empQuery, (err, results) => {
    if (err) throw err;
    res.render("accounts/payslip-form", {
      layout: "layouts/accounts-layout",
      employees: results,
    });
  });
});

router.post("/slip", (req, res) => {
  const payGen = `SELECT 
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
    st.total_salary
  FROM
    payroll3.employees emp
  JOIN
     payroll3.departments dpt on dpt.id = emp.dpt_id
  JOIN
     payroll3.hours hrs on emp.id = hrs.emp_id
  JOIN
     payroll3.salaries st on st.hrs_id = hrs.id
  JOIN
    payroll3.paycycles pc on pc.id = st.paycycle_id
    
    WHERE emp.id LIKE '%${req.body.id}%' `;

  conn.query(payGen, (err, results) => {
    if (err) throw err;
    res.render("accounts/payslip", {
      payslip: results,
      layout: "layouts/accounts-layout",
    });
    console.log(results);
  });
});

module.exports = router;
