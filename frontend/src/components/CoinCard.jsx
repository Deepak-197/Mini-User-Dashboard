export default function CoinCard({ coin }) {
  const change = coin.price_change_percentage_24h;

  const isPos = typeof change === "number" && change >= 0;

  return (
    <>
      <div className="card">
        <div className="card-left">
          <img src={coin.image} alt={coin.name} className="logo" />

          <div>
            <div className="name">
              {coin.name}{" "}
              <span className="symbol">{coin.symbol.toUpperCase()}</span>
            </div>
            <div className="price">${coin.current_price?.toLocaleString()}</div>
          </div>
        </div>
        <div className="card-right">
          <div className={`change ${isPos ? "pos" : "neg"}`}>
            {change === null || change === undefined
              ? "N/A"
              : `${change.toFixed(2)}%`}
          </div>
          <div className="marketcap">${coin.market_cap?.toLocaleString()}</div>
        </div>
      </div>
    </>
  );
}
