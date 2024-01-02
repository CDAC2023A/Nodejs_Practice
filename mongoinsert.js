const dbConnect = require("./mongodb");

const insertdataOne = async () => {
  const db = await dbConnect();
  const result = db.insertOne({
    name: " s23fe",
    brand: "samsung",
    price: 80000,
    category: "smartphone"
  });
};

const insertdataMany = async () => {
    const db = await dbConnect();
    const result = db.insertMany([
        {
      name: " s23fe",
      brand: "samsung",
      price: 80000,
      category: "smartphone"
    },
    {
        name: " f45",
        brand: "samsung",
        price: 80000,
        category: "smartphone"
      },
      {
        name: "m20",
        brand: "samsung",
        price: 8000,
        category: "smartphone"
      },
      {
        name: " s22ultra",
        brand: "samsung",
        price: 80000,
        category: "smartphone"
      }
    ]
    );
  };
// insertdataOne();
insertdataMany();