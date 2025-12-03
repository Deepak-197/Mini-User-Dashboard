const CACHE_KEY = "coins_chache_v1";
const CACHE_TTL = 5 * 60 * 1000; // 5 MINUTE

async function fetchCoinsFromServer() {
  const res = await fetch("/api/coins");

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getCoins({ force = false } = {}) {
  const raw = localStorage.getItem(CACHE_KEY);
  const now = Date.now();

  if (!force && raw) {
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed.timestamp &&
        now - parsed.timestamp < CACHE_TTL &&
        Array.isArray(parsed.coins)
      ) {
        return { source: "local", coins: parsed.coins };
      }
    } catch (e) {
      // console.log(e)
    }
  }

  const payload = await fetchCoinsFromServer();
  const coins = payload.coins || [];
  localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, coins }));

  return { source: payload.source || "server", coins };
}
