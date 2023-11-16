"use client";
import { useState, useEffect } from "react";
import { geturl } from "../util";

function SellRequest(props: any) {
  const [sellData, setSellData] = useState({ data: [] });
  useEffect(() => {
    fetch(geturl(`/stocks/sell`))
      .then((response) => response.json())
      .then(setSellData);
  }, []);

  return (
    <>
      <table className="main_table">
        <caption>{sellData.data.length}</caption>
        <thead>
          <tr>
            <th>Seller Id</th>
            <th>Stock Name</th>
            <th>Total Quantity</th>
            <th>Available Quantity</th>
            <th>Bid</th>
            <th>SOLD</th>
          </tr>
        </thead>
        <tbody>
          {sellData.data.map((stock) => (
            <tr key={stock._id}>
              <td>{stock.seller_id}</td>
              <td>{stock.stock_name}</td>
              <td>{stock.quantity}</td>
              <td>{stock.quantity_available}</td>
              <td>{stock.bid}</td>
              <td>
                {"sold" in stock && (
                  <table className="sub_table">
                    <thead>
                      <tr>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stock.sold.map((sold_stock) => (
                        <tr key={sold_stock.buying_stock_id}>
                          <td>{sold_stock.quantity}</td>
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
export default SellRequest;
