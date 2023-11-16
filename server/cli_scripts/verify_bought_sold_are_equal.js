const { MongoClient } = require("mongodb");
const { DB_NAME, MONGODB_URI } = require("../config");

const db = new MongoClient(MONGODB_URI).db(DB_NAME);
(async () => {
  const soldData = await db
    .collection("selling_stocks")
    .aggregate([
      {
        $group: {
          _id: "$stock_code",
          total_quantity: { $sum: "$quantity" },
          total_quantity_available: { $sum: "$quantity_available" },
        },
      },
      {
        $project: {
          // total_quantity sold
          total_quantity: {
            $subtract: ["$total_quantity", "$total_quantity_available"],
          },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  const boughtData = await db
    .collection("buying_stocks")
    .aggregate([
      { $match: { bought: { $exists: true } } }, // selected completed buying
      { $group: { _id: "$stock_code", total_quantity: { $sum: "$quantity" } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  console.log(
    "- Sold count: " +
      soldData.reduce((sumSofar, item) => sumSofar + item.total_quantity, 0)
  );
  console.log(
    "- Bought count: " +
      boughtData.reduce((sumSofar, item) => sumSofar + item.total_quantity, 0)
  );
  if (JSON.stringify(soldData) == JSON.stringify(boughtData))
    console.log("--- Sold and bought items are EQUAL.");
  else console.log("--- Sold and bought items are NOT equal.");

  process.exit(0);
})();
