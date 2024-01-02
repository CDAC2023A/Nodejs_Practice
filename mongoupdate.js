const dbConnect = require("./mongodb");

const updatedataOne = async () => {
  let db = await dbConnect();
  const result = await db.updateOne(
    { name: "s100fe" },
    {
      $set: { name: "s23fe" },
    }
  );
};
const updatedataMany = async () => {
  let db = await dbConnect();
  const result = await db.updateMany(
    {
      $or: [{ name: "s100fe" }, { name: " f45" }],
    },
    {
      $set: { name: "s23ultra..." },
    }
  );
};
// updatedataOne();
updatedataMany();
