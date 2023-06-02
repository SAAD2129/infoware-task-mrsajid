const mysql = require("mysql");

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// creating employee
exports.registerEmployee = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            FullName,
            JobTitle,
            Address,
            City,
            State,
            primaryContactName,
            secondaryContactName,
            primaryContactNo,
            secondaryContactNo,
            primaryRelation,
            secondaryRelation,
        } = req.body;

        // Insert employee data into the database
        const employeeSql = `INSERT INTO employee (FullName, JobTitle, Address, City, State) VALUES (?, ?, ?, ?, ?)`;
        const employeeValues = [FullName, JobTitle, Address, City, State];
        pool.query(employeeSql, employeeValues, (err, fields) => {
            if (err) return res.json({ msg: "internal server error", err });

            // getting id of current employee inserted to map contacts with
            const empId = fields.insertId;
            // contact insertion query
            const contactSql = `INSERT INTO contactdetails (primaryContactName, primaryContactNo, primaryRelation, secondaryContactName, secondaryContactNo, secondaryRelation, empId) VALUES (?, ?, ?, ?, ?, ?, ?)`;

            // contact values setting
            const contactValues = [
                primaryContactName,
                primaryContactNo,
                primaryRelation,
                secondaryContactName,
                secondaryContactNo,
                secondaryRelation,
                empId,
            ];

            // inserting contact details
            pool.query(contactSql, contactValues);
        });

        // Insert contact details into the database

        // Return the response
        res.json({
            success: true,
            message: "Employee registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "An error occurred while registering employee",
        });
    }
    // closing the connection
    connection.release();
};

/**
 * Retrieves an employee by their ID.
 * @param {Object} req - The request object containing the employee ID in the query.
 * @param {Object} res - The response object to send the result.
 */

// getting a single employee with id
exports.getEmployee = async (req, res) => {
    try {
        // Extract employee ID from the request query
        const { id } = req.query;

        // SQL query to retrieve employee by ID
        const sql = `SELECT Employee.*, ContactDetails.* FROM Employee INNER JOIN ContactDetails ON Employee.EmployeeID = ContactDetails.empID WHERE EmployeeID = ${id}`;
        const values = [id];

        pool.query(sql, values, (error, results) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    error: "An error occurred while retrieving employee",
                });
                return;
            }
            // if id is wrong
            if (results.length === 0) {
                res.json({ success: false, message: "Employee not found" });
                return;
            }

            // Return the employee data
            res.json({ success: true, employee: results[0] });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "An error occurred while retrieving employee",
        });
    }
    // closing the connection
    connection.release();
};

// update Employee Function with Multiple Values
exports.updateEmployee = async (req, res) => {
    const { id } = req.query;
    const valuesToUpdate = req.body;
    const keys = Object.keys(valuesToUpdate);

    let query = "UPDATE employee SET ";

    keys.forEach((key, index) => {
        if (index === 0) {
            query += `${key} = '${valuesToUpdate[key]}'`;
        } else {
            query += `, ${key} = '${valuesToUpdate[key]}'`;
        }
    });
    query += ` WHERE EmployeeID = '${id}'`;
    pool.getConnection((err, connection) => {
        if (err) {
            // Handle connection error

            res.json({ msg: "Error acquiring database connection:", err });
            return;
        }
        connection.query(query, (err, results, fields) => {
            if (err) {
                res.status(500).send("Error updating values");
            } else {
                res.status(200).send("Employee updated successfully");
            }
        });
    });
    // closing the connection
    connection.release();
};

// deleteEmployee function that deletes Employee
/**
 * Deletes an employee by their ID.
 * @param {Object} req - The request object containing the employee ID in the query.
 * @param {Object} res - The response object to send the result.
 */
exports.deleteEmployee = async (req, res) => {
    try {
        // Extract employee ID from the request query
        const { id } = req.query;

        // SQL query to delete employee by ID
        const sql = `DELETE Employee.*, ContactDetails.* FROM Employee INNER JOIN ContactDetails ON Employee.EmployeeID = ContactDetails.empID WHERE EmployeeID = ?`;
        const values = [id];

        pool.query(sql, values, (error, results) => {
            if (error) {
                res.status(500).json({
                    success: false,
                    error: "An error occurred while deleting employee",
                });
                return;
            }

            // Check if any rows were affected by the delete operation
            if (results.affectedRows === 0) {
                res.json({ success: false, message: "Employee not found" });
                return;
            }

            // Return the success message
            res.json({
                success: true,
                message: "Employee deleted successfully",
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "An error occurred while deleting employee",
        });
    }
    // closing the connection
    connection.release();
};

// get all Employees using pagination --- Multiple Employees
exports.getEmployees = async (req, res) => {
    // getting the page and limit how much elements to show
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;

    const countQuery = "SELECT COUNT(*) AS total FROM Employee";
    const selectQuery = `SELECT Employee.*, ContactDetails.* FROM Employee INNER JOIN ContactDetails ON Employee.EmployeeID = ContactDetails.empId
    LIMIT ${limit} OFFSET ${offset}`;

    pool.getConnection((err, connection) => {
        if (err) {
            res.json({ msg: "Error acquiring database connection:", err });
            return;
        }

        connection.query(countQuery, (err, countResults) => {
            if (err) {
                res.json({ msg: "Error executing count query:", err });
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            const total = countResults[0].total;

            connection.query(selectQuery, (err, selectResults) => {
                if (err) {
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }
                const employees = selectResults;
                res.json({
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: total,
                    data: employees,
                });
            });

            // closing the connection
            connection.release();
        });
    });
};

// Don't call connection.end() or connection.destroy() here
