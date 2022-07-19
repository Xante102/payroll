const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const salary = `SELECT 
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
  `;

  conn.query(salary, (err, rows) => {
    if (err) throw err;
    res.render("salaries/salary-preview", {
      layout: "layouts/supervisor-layout",
      salary: rows,
    });
  });
});

router.get("/edit/:salary_id", (req, res) => {
  const salaryId = req.params.salary_id;
  const departments = `SELECT * FROM departments`;
  const paycycle = `SELECT * FROM paycycles`;

  const salaryEdit = `SELECT 
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
    
    WHERE st.id =${salaryId}`;

  conn.query(salaryEdit, (err, sRows) => {
    if (err) throw err;
    conn.query(departments, (err, dRows) => {
      if (err) throw err;
      conn.query(paycycle, (err, pRows) => {
        if (err) throw err;
        res.render("salaries/edit-salary", {
          layout: "layouts/supervisor-layout",
          salary: sRows[0],
          departments: dRows,
          paycycle: pRows,
        });
      });
    });
  });
});

router.post("/update", (req, res) => {
  const updateHrs = `UPDATE hours SET hrs='${req.body.hrs}', ovt_hrs='${req.body.ovt_hrs}' WHERE id =${req.body.hrs_id}`;
  conn.query(updateHrs, (err, hrsRows) => {
    if (err) throw err;
    res.redirect("/preview");
  });
});

module.exports = router;