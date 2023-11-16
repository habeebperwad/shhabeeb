"use client";
import { useState, useEffect } from "react";
import { geturl } from "../util";

function BuyingRequest(props: any) {
  const [buyData, setBuyData] = useState({ data: [] });
  useEffect(() => {
    fetch(geturl(`/stocks/buy`))
      .then((response) => response.json())
      .then(setBuyData);
  }, []);

  return (
    <>
      <table className="main_table">
        <caption>{buyData.data.length}</caption>
        <thead>
          <tr>
            <th>Buyer Id</th>
            <th>Stock Name</th>
            <th>Bid</th>
            <th>Quantity</th>
            <th>BOUGHT</th>
          </tr>
        </thead>
        <tbody>
          {buyData.data.map((stock) => (
            <tr key={stock._id}>
              <td>{stock.buyer_id}</td>
              <td>{stock.stock_name}</td>
              <td>{stock.bid}</td>
              <td>{stock.quantity}</td>
              <td>
                {"bought" in stock && (
                  <table className="sub_table">
                    <thead>
                      <tr>
                        <th>Bid</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stock.bought.map((bought_stock) => (
                        <tr key={bought_stock.selling_stock_id}>
                          <td>{bought_stock.bid}</td>
                          <td>{bought_stock.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default BuyingRequest;
