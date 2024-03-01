const fs = require("fs");
const os = require("os");
console.log("12345");

//const result = fs.readFileSync("contacts.txt", "utf-8");
fs.readFile("contacts.txt", "utf-8", (err, result) => {
  console.log(result);
});
//console.log(result);
console.log("987654");

//console.log(os.cpus().length);
