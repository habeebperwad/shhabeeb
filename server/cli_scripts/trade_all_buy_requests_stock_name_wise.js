const { MongoClient } = require("mongodb");
const { DB_NAME, MONGODB_URI } = require("../config");
const { matchBuying } = require("../trade_engine");
const client = new MongoClient(MONGODB_URI);

async function tradeByStockName(stockName) {
  console.log(`@${stockName}`);
  const stocksBuy = await client.db(DB_NAME).collection("buying_stocks");
  const stockItems = await stocksBuy
    .find({ stock_name: stockName, bought: { $exists: false } })
    .sort({ date: 1 })
    .toArray();
  for (const stockItem of stockItems) {
    //console.log(`@${stockName}: ${stockItem._id}`);
    await matchBuying(client, stockItem._id);
  }
}

async function tradeAllBuyRequestsStockNameWise() {
  const stocksBuy = await client.db(DB_NAME).collection("buying_stocks");
  const stockItems = await stocksBuy
    .aggregate([
      {
        $match: {
          bought: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$stock_name",
          oldestTradeRequestDate: {
            $min: "$date",
          },
        },
      },
      {
        $sort: {
          oldestTradeRequestDate: 1,
        },
      },
    ])
    .toArray();
  //console.log(stockItems);
  const promises = [];
  for (const stockItem of stockItems) {
    promises.push(tradeByStockName(stockItem["_id"]));
  }
  return Promise.all(promises);
}

tradeAllBuyRequestsStockNameWise()
  .catch(console.log)
  .finally(() => process.exit(0));
