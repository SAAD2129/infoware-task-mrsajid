const express = require("express");
const {
  registerEmployee,
  getEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} = require("../controllers/employee");
const router = express.Router();

// Single Employee routes and controllers
router.route("/employee").post(registerEmployee);
router.route("/employee").get(getEmployee);
router.route("/employee").put(updateEmployee);
router.route("/employee").delete(deleteEmployee);

// Getting all Employees
router.route("/employees").get(getEmployees);

module.exports = router;
