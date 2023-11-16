const { ObjectId } = require("mongodb");
const { DB_NAME, MONGODB_URI } = require("./config");

async function getSellingStocks(stock_name, database, session) {
  const sellingStocksCol = database.collection("selling_stocks");
  const sellingStocks = await sellingStocksCol
    .find(
      {
        stock_name: stock_name,
        quantity_available: { $gt: 0 },
      },
      { session }
    )
    .sort({ bid: 1 })
    .toArray();
  return sellingStocks;
}

async function matchBuying(client, buyingStockId) {
  let bought = [];

  let sestionStartedFlag = false;

  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      if (sestionStartedFlag) {
        console.log("Retrying db transaction " + buyingStockId);
      }
      sestionStartedFlag = true;

      const db = client.db(DB_NAME);
      const stocks = db.collection("buying_stocks");

      const item = await stocks.findOne(
        { _id: new ObjectId(buyingStockId) },
        { session }
      );
      const items = await getSellingStocks(item.stock_name, db, session);

      let boughtStocks = [];
      let potentionStocks = {};
      let totalNeeded = item.quantity;
      for (let value of items) {
        if (totalNeeded > 0 && item.bid >= value.bid) {
          boughtStocks.push({
            selling_stock_id: value._id,
            bid: value.bid,
            quantity:
              totalNeeded > value.quantity_available
                ? value.quantity_available
                : totalNeeded,
          });
          potentionStocks[value._id] = value;
          totalNeeded -= value.quantity_available;
        }
      }
      if (totalNeeded <= 0) {
        for (let stock of boughtStocks) {
          /*await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 3000)
          );*/
          const rawStock = potentionStocks[stock.selling_stock_id];
          const sold = "sold" in rawStock ? rawStock.sold : [];
          sold.push({
            buyingStockId: new ObjectId(buyingStockId),
            quantity: stock.quantity,
          });

          const stocks_sell = db.collection("selling_stocks");
          await stocks_sell.findOneAndUpdate(
            { _id: stock.selling_stock_id },
            {
              $set: {
                quantity_available:
                  rawStock.quantity_available - stock.quantity,
                sold: sold,
              },
            },
            { session }
          );
        }

        await stocks.findOneAndUpdate(
          { _id: new ObjectId(buyingStockId) },
          { $set: { bought: boughtStocks } },
          { session }
        );
        bought = boughtStocks;
      }
    });
  } catch (error) {
    console.log("Transaction aborted!");
  } finally {
    await session.endSession();
  }
  return bought;
}

async function matchSelling(client, selling_stock_id) {
  let sold = [];
  // TO BE DONE
  return sold;
}

module.exports = { matchSelling, matchBuying };
