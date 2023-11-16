const { MongoClient } = require("mongodb");
const { DB_NAME, MONGODB_URI } = require("../config");

const db = new MongoClient(MONGODB_URI).db(DB_NAME);
(async () => {
  await db.collection("buying_stocks").drop();
  await db.collection("selling_stocks").drop();
  process.exit(0);
})();
