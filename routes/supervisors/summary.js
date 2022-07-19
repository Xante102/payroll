const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const departments = `SELECT * FROM departments`;

  conn.query(departments, (err, rows) => {
    if (err) throw err;
    res.render("salaries/summary", {
      layout: "layouts/supervisor-layout",
      departments: rows,
    });
    console.log(rows);
  });
});

router.post("/list", (req, res, next) => {
  const id = req.body.id;
  const sql = `SELECT 
  emp.id AS emp_id,
  emp.f_name,
  emp.l_name,
  dpt.id AS dpt_id,
  dpt.department_name,
  pc.id AS paycycle_id,
  pc.date_from,
  pc.date_to,
  pc.status,
  hrs.hrs,
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
WHERE dpt.id LIKE '%${id}%';`;
  conn.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(rows);
    res.render("salaries/summary-list", {
      salary: rows,
      layout: "layouts/supervisor-layout",
    });
  });
});
module.exports = router;