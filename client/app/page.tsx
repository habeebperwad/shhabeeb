"use client";
import BuyingRequest from "./components/buy";
import SellRequest from "./components/sell";

export default function Home() {
  return (
    <main>
      <div className="row">
        <div className="column">
          <BuyingRequest />
        </div>
        <div className="column">
          <SellRequest />
        </div>
      </div>
    </main>
  );
}
