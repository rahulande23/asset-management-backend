const mysql2 = require("mysql2/promise");

let connection = null;

const connect = async () => {
  try {
    connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    console.log("Database connected successfully");
    return connection;
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    throw error;
  }
};

const getConnection = () => connection;

module.exports = { connect, getConnection };
