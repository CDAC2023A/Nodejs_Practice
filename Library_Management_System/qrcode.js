const qr = require("qrcode");

let data = {
  name: "Akash Niwane",
  email: "akash@gmail.com",
  gender: "male",
  id: 123,
};
let setJson = JSON.stringify(data);
// qr.toString(setJson, { type: "terminal" }, function (err, code) {
//   if (err) {
//     return console.log("error");
//   } else {
//     console.log(code);
//   }
// });
// qr.toDataURL(setJson, function (err, code) {
//   if (err) {
//     return console.log("error");
//   } else {
//     console.log(code);
//   }
// });
qr.toFile("qr.png", setJson, function (err) {
  if (err) {
    return console.log("error");
  }
});
