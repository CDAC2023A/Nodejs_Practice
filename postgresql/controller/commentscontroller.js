const pool2 = require("../databases/dbcomments");

exports.getAllcomments = async (req, res) => {
  try {
    const allNotes = await pool2.query("SELECT * FROM comments");
    res.json(allNotes.rows);
  } catch (err) {
    console.error(err.message);
  }
};
// Fetch comments by get ID
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await pool2.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postId]
    );
    res.json(comments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Fetch comments by post ID including child comments
exports.getCommentsByPostIdWithChildren = async (req, res) => {
  try {
    const { postId } = req.params;
    const query = `
        WITH RECURSIVE CommentTree AS (
          SELECT id, text, parent_id, post_id
          FROM comments
          WHERE post_id = $1 AND parent_id IS NULL
          UNION ALL
          SELECT c.id, c.text, c.parent_id, c.post_id
          FROM comments c
          JOIN CommentTree ct ON c.parent_id = ct.id
        )
        SELECT * FROM CommentTree;
      `;
    const comments = await pool2.query(query, [postId]);
    res.json(comments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
