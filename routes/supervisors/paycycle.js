const express = require("express");
const router = express.Router();
const conn = require("../../lib/db");

router.get("/", (req, res) => {
  const cycle = `SELECT * FROM paycycles`;
  conn.query(cycle, (err, results) => {
    if (err) throw err;
    res.render("paycycles/add-paycycle", {
      layout: "layouts/supervisor-layout",
      cycles: results,
    });
  });
});

router.post("/add", (req, res) => {
  const cycleData = {
    date_from: req.body.date_from,
    date_to: req.body.date_to,
  };

  const cycleQuery = `INSERT INTO paycycles SET ?`;

  conn.query(cycleQuery, cycleData, (err, result) => {
    if (err) throw err;
    res.redirect("/paycycle");
  });
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const editQuery = `SELECT * FROM paycycles WHERE id = ${id}`;

  conn.query(editQuery, (err, rows) => {
    if (err) throw err;
    res.render("paycycles/edit-paycycle", {
      layout: "layouts/supervisor-layout",
      cycle: rows[0],
    });
  });
});

router.post("/update", (req, res) => {
  const updateCycle = `UPDATE paycycles SET date_from='${req.body.date_from}', date_to='${req.body.date_to}' WHERE id =${req.body.id}`;
  conn.query(updateCycle, (err, rows) => {
    if (err) throw err;
    res.redirect("/paycycle");
  });
});
module.exports = router;