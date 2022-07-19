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
  payroll3.paycycles pc on pc.id = st.paycycle_id`;

  conn.query(salary, (err, rows) => {
    res.render("accounts/salary-list", {
      layout: "layouts/accounts-layout",
      salary: rows,
    });
  });
});

router.get("/form", (req, res) => {
  const paycycle = `SELECT * FROM paycycles`;
  const departments = `SELECT * FROM departments`;
  const employees = `SELECT * FROM employees`;
  conn.query(paycycle, (err, payRows) => {
    if (err) throw err;
    conn.query(departments, (err, dptRows) => {
      if (err) throw err;
      conn.query(employees, (err, empRows) => {
        if (err) throw err;
        res.render("accounts/add-salary", {
          layout: "layouts/accounts-layout",
          paycycle: payRows,
          departments: dptRows,
          employees: empRows,
        });
      });
    });
  });
});
router.post("/add", (req, res) => {
  const overtimeCalc = 1.5;
  const hrsData = {
    emp_id: req.body.emp_id,
    hrs: req.body.hrs,
    paycycle_id: req.body.paycycle_id,
    ovt_hrs: req.body.ovt_hrs,
  };

  const hrsQuery = `INSERT INTO hours SET ?`;

  conn.query(hrsQuery, hrsData, (err, workResults) => {
    if (err) throw err;

    conn.query(
      `SELECT * FROM departments WHERE id =${req.body.dpt_id}`,
      (err, departResults) => {
        if (err) throw err;

        conn.query(
          `SELECT * FROM hours WHERE emp_id=${req.body.emp_id}`,
          (err, hrsRows) => {
            if (err) throw err;
            const basicHrs = departResults[0].basic_hrs;
            const salaryCalc = departResults[0].rates * basicHrs;
            if (hrsRows[0].hrs > 40) {
              overtimeCalc =
                departResults[0].rates * overtime * workRows[0].ovt_hrs;
            } else {
              overtimeCalc = 0;
            }

            const totalSalary = overtimeCalc + salaryCalc;

            const salaryData = {
              emp_id: req.body.emp_id,
              dpt_id: req.body.dpt_id,
              paycycle_id: req.body.paycycle_id,
              hrs_id: hrsResults.insertId,
              salary: salaryCalc,
              overtime: overtimeCalc,
             total_salary: totalSalary,
            };
            const salaryQuery = `INSERT INTO salaries SET ?`;
            conn.query(salaryQuery, salaryData, (err, salaryRows) => {
              if (err) throw err;
              res.redirect("/salary-list");
            });
          }
        );
      }
    );
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
        res.render("accounts/edit-salary", {
          layout: "layouts/accounts-layout",
          salary: sRows[0],
          departments: dRows,
          paycycle: pRows,
        });
      });
    });
  });
});

router.post("/update", (req, res) => {
  const updateHrs = `UPDATE hours SET hrs='${req.body.hrs}', paycycle_id='${req.body.paycycle_id}', ovt_hrs='${req.body.ovt_hrs}' where id =${req.body.hrs_id}`;
  conn.query(updateHrs, (err, hoursRows) => {
    if (err) throw err;
    const updateSalary = `UPDATE salaries SET dpt_id='${req.body.dpt_id}', paycycle_id='${req.body.paycycle_id}', salary='${req.body.salary}', overtime='${req.body.overtime}', final_salary='${req.body.final_salary}' where id =${req.body.salary_id}`;
    conn.query(updateSalary, (err, sRows) => {
      if (err) throw err;
      res.redirect("/salary-list");
    });
  });
});

module.exports = router;