const express = require("express");
const axios = require("axios");
const app = express();

let wordList = [];
axios
  .get(
    "https://raw.githubusercontent.com/qualified/challenge-data/master/words_alpha.txt"
  )
  .then((response) => {
    wordList = response.data.split("\n");
  })
  .catch((error) => {
    console.error("Error fetching word list:", error);
  });

app.get("/", (req, res) => {
  const { stem } = req.query;

  if (!stem) {
    return res.json(wordList);
  }

  const filteredWords = wordList.filter((word) => word.startsWith(stem));

  res.json(filteredWords);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
