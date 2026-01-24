require('dotenv').config(); // Pastikan install dotenv: npm install dotenv

module.exports = {
  development: {
    username: process.env.DB_USER || "administrator",
    password: process.env.DB_PASSWORD || "echoAdza32",
    database: process.env.DB_NAME || "admin_db", // Sesuaikan per service
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    // Logika Port: Kalau di Docker (ada DB_HOST) pake 3306, kalau local pake 3307
    port: process.env.DB_HOST ? 3306 : 3307
  },
  test: {
    username: process.env.DB_USER || "administrator",
    password: process.env.DB_PASSWORD || "echoAdza32",
    database: process.env.DB_NAME || "admin_db",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
  }
};