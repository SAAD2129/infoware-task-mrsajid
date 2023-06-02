const express = require("express");

const app = express();
require("dotenv").config()
const PORT = process.env.PORT || 5000;
// const emp__route = ;

// middleware
app.use(express.json());
app.use("/api/v1/", require("./routes/employee"));

// server is listening here
const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} is running`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // Perform any necessary cleanup or logging here
    console.log("server is being shutdown due to some internal errors");
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
    console.log("server is being shutdown due to some internal errors");
    // Perform any necessary cleanup or logging here
    process.exit(1);
});
