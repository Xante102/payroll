const express = require("express");
const layout = require("express-ejs-layouts");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.use(layout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.use(flash());
app.use(cookieParser());
app.use(
  session({
    secret: "s3cr3tc0d3#%!@3",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 120000000 },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/no-nav");

const adminRouter = require("./routes/admin/dashboard");
const loginRouter = require("./routes/login");
const employeeRouter = require("./routes/admin/employees");
const salaryRouter = require("./routes/admin/salaries");
const salaryInfoRouter = require("./routes/supervisors/salary-info");
const salaryDetailsRouter = require("./routes/accounts/salary-details");
const summaryRouter = require("./routes/supervisors/summary");
const overtimeRouter = require("./routes/admin/overtime");
const paycycleRouter = require("./routes/supervisors/paycycle");
const paycycleResultsRouter = require("./routes/accounts/search-cycle");
const payslipRouter = require("./routes/accounts/payslip");
const employeesalaryRouter = require("./routes/employees/paycycle-form");
const previewRouter = require("./routes/supervisors/preview");
const absentRouter = require("./routes/supervisors/absent");

app.use("/", loginRouter);
app.use("/admin", adminRouter);
app.use("/employees", employeeRouter);
app.use("/absent", absentRouter);
app.use("/salaries", salaryRouter);
app.use("/salaryInfo", salaryInfoRouter);
app.use("/salary-list", salaryDetailsRouter);
app.use("/summary", summaryRouter);
app.use("/overtime", overtimeRouter);
app.use("/paycycle", paycycleRouter);
app.use("/paycycle-results", paycycleResultsRouter);
app.use("/payslip", payslipRouter);
app.use("/employee-salary", employeesalaryRouter);
app.use("/preview", previewRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});
