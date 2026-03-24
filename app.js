require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);

// Initialize database and start server
// async function startServer() {
//   try {
//     await database.connect();

//     app.listen(config.PORT, () => {
//       console.log(`Server started on port ${config.PORT}`);
//     });
//   } catch (error) {
//     console.error(`Server startup error: ${error}`);
//     process.exit(1);
//   }
// }

// startServer();

module.exports = app;
