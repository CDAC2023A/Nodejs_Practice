module.exports = {
};
const { Socket } = require("dgram");
// const { log } = require("console");
// const os = require("os");

// var totalmemory=os.totalmem();
// var freeMemory=os.freemem();

// console.log(`freememory:${freeMemory}`);
// console.log(`freememory:${totalmemory}`);

// const fs = require("fs");
// // const  files= fs.readFileSync('./');
// // console.log(files);

// fs.readdir("./", function (err, files) {
//   if (err) {
//     console.log("error", err);
//   } else {
//     console.log("result", files);
//   }
// });

//Event

// const EventEmitter =require('events');

// const emitter= new EventEmitter();

// //Register a listener
// emitter.on('messageLogged',(arg) =>{
//   console.log('listner called',arg)
// })

// //Raised an event
// emitter.emit('messageLogged',{id:1,url:'http://'});

//http

const http = require("http");

const server = http.createServer((req,res)=>{
if(req.url==='/'){
  res.write('Hello World');
  res.end();
}
});

// server.on('connection',(Socket)=>{
// console.log('new connection');
// });

server.listen(3000);
console.log("LISTENING ON PORT 3000....");
