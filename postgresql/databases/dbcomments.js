const Pool = require("pg").Pool;

const pool2 = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  port: 5432,
  database: "demo",
});
module.exports = pool2;
