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

//PUT
app.put("/api/courses/:id", (req,res) => {

  const courseId = parseInt(req.params.id);
  const newName = req.body.name;

  // Find the course by id
  const courseToUpdate = courses.find(course => course.id === courseId);

  if (!courseToUpdate) {
    return res.status(404).send('Course not found');
  }

  // Update the course name
  courseToUpdate.name = newName;

  // Send a response
  res.send(courseToUpdate);

});

//DELETE
app.delete("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id);

  // Find the index of the course by id
  const courseIndex = courses.findIndex(course => course.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).send('Course not found');
  }

  // Remove the course from the array
  const deletedCourse = courses.splice(courseIndex, 1)[0];

  // Send a response with the deleted course
  res.send(deletedCourse);
});

function ValidateCourse(course) {
  if (!course.name || course.name < 3) {
    res.status(400).send("Name req min 3 characters");
    return;
  }
}

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening the port ${port}......`));
