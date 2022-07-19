const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const empQuery = `SELECT * FROM employees`;
  const cycleQuery = `SELECT * FROM paycycles`;
  conn.query(empQuery, (err, empResult) => {
    if (err) throw err;
    conn.query(cycleQuery, (err, cycleResult) => {
      if (err) throw err;
      res.render("accounts/search-paycycle", {
        layout: "layouts/accounts-layout",
        employees: empResult,
        paycycle: cycleResult,
      });
    });
  });
});

router.post("/list", (req, res) => {
  const aggregate = `SELECT 
  MAX(st.total_salary)AS max_salary,
  SUM(hrs.hrs) AS total_hrs,
  AVG(st.total_salary)AS avg_salary,
  SUM(st.total_salary)AS total_salary
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
  
  WHERE emp.id LIKE  '%${req.body.emp_id}%' AND pc.id LIKE '%${req.body.cycle_id}%'
  `;
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
  
  WHERE emp.id LIKE  '%${req.body.emp_id}%' AND pc.id LIKE '%${req.body.cycle_id}%'`;
  conn.query(cycleResult, (err, cycleResult) => {
    if (err) throw err;
    conn.query(aggregate, (err, aggResult) => {
      if (err) throw err;
      res.render("accounts/paycycle-results", {
        payinfo: cycleResult,
        aggregate: aggResult[0],
        layout: "layouts/accounts-layout",
      });
    });
  });
});

module.exports = router;