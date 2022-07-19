const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const overtime = `SELECT 
    emp.id AS emp_id,
    emp.f_name,
    emp.l_name,
    hrs.hrs,
    hrs.ovt_hrs,
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
WHERE overtime !=0`;

  conn.query(overtime, (err, rows) => {
    if (err) throw err;
    res.render("salaries/overtime-list", {
      layout: "layouts/admin-layout",
      overtime: rows,
    });
    console.log(rows);
  });
});

module.exports = router;