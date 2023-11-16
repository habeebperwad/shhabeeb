const express = require("express");
const { MongoClient } = require("mongodb");
const { matchBuying, matchSelling } = require("./trade_engine");
const cors = require("cors");
const port = 3100;
const TRADE_AT_API_CALL = false;
const { DB_NAME, MONGODB_URI } = require("./config");

const app = express();
const client = new MongoClient(MONGODB_URI);

app.use(cors());
app.use(express.json());

function send(res, success, data) {
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      success: success,
      data: data,
    })
  );
}

function sendError(res, err) {
  console.dir(err);
  res.setHeader("Content-Type", "application/json");
  res.send(
    JSON.stringify({
      success: false,
      data: "Error occured!",
    })
  );
}

app.post("/stocks/sell", (req, res) => {
  (async () => {
    const sellingStocks = client.db(DB_NAME).collection("selling_stocks");
    const stockData = req.body;
    stockData.quantity_available = stockData.quantity;
    stockData.date = new Date();
    const sellingStock = await sellingStocks.insertOne(stockData);
    const bought = TRADE_AT_API_CALL
      ? await matchSelling(client, sellingStock.insertedId)
      : [];
    send(res, true, {
      status: bought.length > 0 ? "sold" : "queued",
      sold: bought,
    });
  })().catch((err) => sendError(res, err));
});

app.post("/stocks/buy", (req, res) => {
  (async () => {
    const stockData = req.body;
    stockData.date = new Date();
    const buyingStocksCol = client.db(DB_NAME).collection("buying_stocks");
    const buyingStock = await buyingStocksCol.insertOne(stockData);
    const bought = TRADE_AT_API_CALL
      ? await matchBuying(client, buyingStock.insertedId)
      : [];
    send(res, true, {
      status: bought.length > 0 ? "bought" : "queued",
      bought: bought,
    });
  })().catch((err) => sendError(res, err));
});

app.get("/stocks/sell", (req, res) => {
  (async () => {
    const sellingStocksCol = client.db(DB_NAME).collection("selling_stocks");
    const sellingStocks = await sellingStocksCol
      .find()
      .sort({ date: 1 })
      .toArray();
    send(res, true, sellingStocks);
  })().catch((err) => sendError(res, err));
});

app.get("/stocks/buy", (req, res) => {
  (async () => {
    const buyingStocksCol = client.db(DB_NAME).collection("buying_stocks");
    const buyingStocks = await buyingStocksCol
      .find()
      .sort({ date: 1 })
      .toArray();
    send(res, true, buyingStocks);
  })().catch((err) => sendError(res, err));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
