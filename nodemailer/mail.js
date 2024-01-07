const express = require("express");
const app = express();
let PORT = 5000;
const sendMail = require("./sendMail.js");

app.get("/", (req, resp) => {
  resp.send("I am a server");
});

app.get("/sendmail", sendMail, (req, resp) => {

});

const start = async () => {
  try {
    app.listen(5000, () => {
      console.log(`I am in port. ${PORT}`);
    });
  } catch (error) {}
};
start();
