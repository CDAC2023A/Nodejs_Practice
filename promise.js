let a=35;
let b=45;


const waitingdata=new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(b=80);
     },2000)
});

 waitingdata.then((data)=>{
    b=data
    console.log(a+b);
 })

