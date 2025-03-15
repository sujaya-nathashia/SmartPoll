const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "devpoll_db",
  password: "$$322003Sujaya",
  port: 5432,
});

module.exports = pool;
