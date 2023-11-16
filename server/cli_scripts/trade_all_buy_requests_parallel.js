const { MongoClient } = require("mongodb");
const { DB_NAME, MONGODB_URI } = require("../config");
const { matchBuying } = require("../trade_engine");
const client = new MongoClient(MONGODB_URI);

/*
 * DEMO SCRIPT to show transaction failures.
 */
async function trade_all_buy_requests_parallel() {
  const stocksBuy = await client.db(DB_NAME).collection("buying_stocks");
  const stockItems = await stocksBuy
    .find({ bought: { $exists: false } })
    .toArray();

  const promises = [];
  for (const stock_item of stockItems) {
    promises.push(matchBuying(client, stock_item._id));
  }
  return Promise.all(promises);
}

trade_all_buy_requests_parallel()
  .catch(console.log)
  .finally(() => process.exit(0));
