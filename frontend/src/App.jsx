import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import useDebounce from "./hooks/useDebounce";
import { getCoins } from "./api";
import CoinCard from "./components/CoinCard";
import Spinner from "./components/Spinner";
import LightDarkToggleMode from "./components/LightDarkToggleMode";
import useAOS from "./hooks/animation";

function App() {
  useAOS();
  const [coins, setCoins] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dark, setDark] = useState(false);
  const refreshCooldown = useRef(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) setFiltered(coins);
    else
      setFiltered(
        coins.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q)
        )
      );
  }, [debouncedQuery, coins]);

  async function loadCoins({ force = false } = {}) {
    setError(null);
    setLoading(true);
    try {
      const { coins: fetched } = await getCoins({ force });
      setCoins(fetched);
      setFiltered(fetched);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    if (refreshCooldown.current) return;
    refreshCooldown.current = true;
    setTimeout(() => (refreshCooldown.current = false), 800);
    await loadCoins({ force: true });
  }

  return (
    <>
      <div className={dark ? "app dark" : "app"}>
        <header className="header">
          <h2>Mini User Dashboard</h2>
          <div className="controls">
            <input
              placeholder="Search coins by name or symbol..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search"
            />
            <button className="btn" onClick={handleRefresh}>
              Refresh
            </button>

            {/* { Dark Light theme} */}
            <div className="mode">
              <LightDarkToggleMode />
            </div>
          </div>
        </header>

        <main className="main">
          {loading && (
            <div className="center">
              <Spinner />
            </div>
          )}
          {error && <div className="error">Error: {error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="info">No results.</div>
          )}

          <div data-aos="fade-up" className="grid">
            {filtered.map((c) => (
              <CoinCard key={c.id || c.symbol} coin={c} />
            ))}
          </div>
        </main>

        <footer className="footer">
          <small>Data from CoinGecko.</small>
        </footer>
      </div>
    </>
  );
}

export default App;
