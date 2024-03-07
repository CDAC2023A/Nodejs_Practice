const express = require("express");
const app = express();
const noteController = require("./controller/notecontroller");
const commentController = require("./controller/commentscontroller");
//MIDDLEWARE
app.use(express.json());

//ROUTES
app.post("/notes", noteController.createNote);

app.get("/notes/:id", noteController.getOneNote);

app.put("/notes/:id", noteController.updateOneNote);

app.delete("/notes/:id", noteController.deleteOneNote);

app.get("/comments", commentController.getAllcomments);
app.get("/commentsbypostid/:postId", commentController.getCommentsByPostId);
app.get(
  "/commentsbypostidwithchildren/:postId",
  commentController.getCommentsByPostIdWithChildren
);
//PORT
app.listen(8989, () => {
  console.log("Server is running on port 8989");
});
