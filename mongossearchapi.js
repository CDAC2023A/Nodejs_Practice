const express = require("express");
require("./mongosconfigapi");
const products = require("./mongosproduct");

const app = express();
app.use(express.json());

app.get("/search/:key", async (req, resp) => {
   console.log(req.params.key);
  let data = await products.find(
    {"$or":[
        {"name":{$regex:req.params.key}},
        {"brand":{$regex:req.params.key}},
        {"category":{$regex:req.params.key}}
    ]}
  );
  resp.send(data);
});

app.listen(5000);
