const app= require('./app')

var a=20;
var v=48;
var m=78;
// console.warn(a+v+m);
// console.warn(app);
// console.warn(app.t());

const arr=[2,5,3,4,7,3,5,4,3,6,8,9,2,1];

let result=arr.filter((item)=>{
    return item>5;
})
console.log(result);