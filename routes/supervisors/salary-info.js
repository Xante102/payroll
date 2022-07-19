const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const paycycle = `SELECT * FROM paycycles`;
  const departments = `SELECT * FROM departments`;
  const employees = `SELECT * FROM employees`;
  conn.query(paycycle, (err, payRows) => {
    if (err) throw err;
    conn.query(departments, (err, dRows) => {
      if (err) throw err;
      conn.query(employees, (err, empRows) => {
        if (err) throw err;
        res.render("salaries/add-salary", {
          layout: "layouts/supervisor-layout",
          paycycle: payRows,
          departments: dRows,
          employees: empRows,
        });
      });
    });
  });
});

router.post("/add", (req, res) => {
  const overtime = 1.5;
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
          (err, workRows) => {
            if (err) throw err;
            const basicHrs = departResults[0].basic_hrs;
            const salaryCalc = departResults[0].rates * basicHrs;
            if (workRows[0].hrs > 40) {
              overtime =
                departResults[0].rates * overtime * workRows[0].ovt_hrs;
            } else {
              overtime = 0;
            }

            const totalSalary = overtime + salaryCalc;

            const salaryData = {
              emp_id: req.body.emp_id,
              dpt_id: req.body.dpt_id,
              paycycle_id: req.body.paycycle_id,
              hrs_id: workResults.insertId,
              salary: salaryCalc,
              overtime: overtime,
              total_salary: totalSalary,
            };
            const salaryQuery = `INSERT INTO salaries SET ?`;
            conn.query(salaryQuery, salaryData, (err, salaryRows) => {
              if (err) throw err;
              res.redirect("/preview");
            });
          }
        );
      }
    );
  });
});

module.exports = router;