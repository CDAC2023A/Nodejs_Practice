const secretid="ACf5daaf69d436fe1a63db582aedb034fc";
const authtoken="5ddb0184fac27752446e75a668aefd4e";

var twilio= require('twilio')(secretid,authtoken);

twilio.messages.create({
    from:"+14086693714",
    to:"+919404422801",
    body:"this is testing message happy"
})
.then((res)=>(console.log("message has sent..!!")))
.catch((err)=>(console.log("err")));
