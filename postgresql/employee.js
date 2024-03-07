const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.user,
  host: "localhost",
  database: "postgres-api",
  password: process.env.password,
  port: 5432,
});

const createEmployee = (req, resp) => {
  const { name, email } = req.body;

  pool.query("INSERT INTO employees(name,email) VALUES ($1,$2) RETURNING *", [
    name,
    email,
    (err, result),
  ]);
  if (err) {
    console.log(err);
    throw err;
  }
  resp.status(200);
};
