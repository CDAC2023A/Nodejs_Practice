const express = require("express");
const dbConnect = require("./mongodb");
const mongodb=require('mongodb')
const app = express();
app.use(express.json());

app.get("/", async (req, resp) => {
  let data = await dbConnect();
  data = await data.find().toArray();
  console.log(data);
  resp.send(data);
});

app.post("/", async (req, resp) => {
  let data = await dbConnect();
  let result = await data.insertOne(req.body);
  resp.send(result);
});

app.put("/:name",async (req,resp)=>{
    let data = await dbConnect();
    let result= await data.updateOne(
        //{name:req.body.name},
        {name:req.params.name},
        {$set:req.body}
        )
        if (result.modifiedCount === 0) {
            resp.status(404).send({ error: "Name not found in the database" });
        } else {
            resp.send(result);
        }
})

app.delete("/:id", async (req,resp)=>{
    console.log(req.params.id);
    let data = await dbConnect();
    let result= await data.deleteOne({_id:new mongodb.ObjectId(req.params.id)});
    if (result.deletedCount  === 0) {
        resp.status(404).send({ error: "Id not found in the database" });
    } else {
        resp.send({ result: "updated" });
    }
})


app.listen(5000);
