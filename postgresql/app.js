const express = require("express");
const dotenv = require("dotenv");
//import express from "express";
const app = express();
//import dotenv from "dotenv";
dotenv.config();
app.use(express.json());
const PORT = 6000;

app.get("/", (req, resp) => {
  resp.send("Hello from World Express");
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
