const dbConnect = require("./mongodb");

const deletedataOne = async () => {
  const db = await dbConnect();
  const result = await db.deleteOne({ name: "m40" });
  console.log(result);
};
const deletedataMany = async () => {
    const db = await dbConnect();
    const result = await db.deleteMany({ name: "s22ultra" });
    if(result.acknowledged){
        console.log('deleted success');
    }
  };

  deletedataMany();