/*
 * TEST SCRIPT for pushing data to stocks_db via REST API
 * run: node <this_script_filename.js>
 */

const URL_BASE = "http://127.0.0.1:3100";
const URL_SELL = `${URL_BASE}/stocks/sell`;
URL_BUY = `${URL_BASE}/stocks/buy`;
const stockCodes = ["AMZN", "META", "TWTR", "AAPL"];

async function pushData() {
  for (let usedIdIndex = 1; usedIdIndex < 6; usedIdIndex++) {
    for (const stockCodeId in stockCodes) {
      const stockCode = stockCodes[stockCodeId];
      for (let stockCodeIndex = 1; stockCodeIndex < 6; stockCodeIndex++) {
        const sdata = {
          seller_id: 10 + usedIdIndex,
          stock_name: stockCode + stockCodeIndex,
          bid: 10 + 2 * stockCodeIndex + usedIdIndex,
          quantity: 12 * stockCodeIndex + usedIdIndex + stockCodeIndex,
        };

        console.log(
          `# Buyer: ${sdata["seller_id"]} Stock: ${sdata["stock_name"]}`
        );
        await fetch(URL_SELL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sdata),
        }).catch(console.log);

        const bdata = {
          buyer_id: 12 + usedIdIndex,
          stock_name: stockCode + stockCodeIndex,
          bid: 10 + 2 * usedIdIndex + stockCodeIndex,
          quantity: 10 * stockCodeIndex + usedIdIndex + stockCodeIndex,
        };

        console.log(
          `# Seller: ${bdata["buyer_id"]} Stock: ${bdata["stock_name"]}`
        );
        await fetch(URL_BUY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bdata),
        }).catch(console.log);
      }
    }
  }
}

pushData();
