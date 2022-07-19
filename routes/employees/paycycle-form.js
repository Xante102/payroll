const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const cycleQuery = `SELECT * FROM paycycles`;
  conn.query(cycleQuery, (err, cycleResult) => {
    if (err) throw err;
    res.render("employees/employee-salary", {
      layout: "layouts/employee-layout",
      paycycle: cycleResult,
    });
  });
});

router.post("/salary", (req, res) => {
  const cycleResult = `SELECT 
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
    
    WHERE emp.id LIKE  '%${req.session.emp_id}%' AND pc.id LIKE '%${req.body.paycycle_id}%'`;
  conn.query(cycleResult, (err, cycleResult) => {
    if (err) throw err;
    res.render("employees/salary", {
      payinfo: cycleResult,
      layout: "layouts/employee-layout",
    });
  });
});

module.exports = router;