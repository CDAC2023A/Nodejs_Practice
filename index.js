const express = require("express");
const app = express();
const users = require("./users");
app.use(express.json());

const courses = [
  { id: 1, name: "nodejs" },
  { id: 2, name: "angular" },
  { id: 3, name: "java" },
];

//GET METHOD
app.get("/", (req, res) => {
  res.send(users.users);
});

app.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.users.find((u) => u.id === userId);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.query);
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//POST METHOD
app.post("/api/courses", (req, res) => {
  if (!req.body.name || req.body.name < 3) {
    res.status(400).send("Name req min 3 characters");
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening the port ${port}......`));
