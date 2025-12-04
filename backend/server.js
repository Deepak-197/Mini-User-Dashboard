
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// simple server-side cache to reduce upstream calls
let cache = {timestamp: 0, data: null};
const CACHE_TTL_MS = 60 * 1000; // 1 minute


app.get("/api/coins", async (req, res) => {
    try {
        const now = Date.now();

        if(cache.data && now - cache.timestamp < CACHE_TTL_MS){
            return res.json({ source: "cache", coins: cache.data});
        }

        const url = "https://api.coingecko.com/api/v3/coins/markets";
        const params = {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1
        };

        const response = await axios.get(url, {params, timeout: 8000});

        if(!Array.isArray(response.data)){
            return res.status(502).json({error: 'Invalid response from upstream API'});
        }

        const coins = response.data.map(e => ({
            id: e.id,
            name: e.name,
            symbol: e.symbol,
            current_price: e.current_price,
            price_change_percentage_24h: e.price_change_percentage_24h,
            market_cap: e.market_cap,
            image: e.image
        }));

        cache = {timestamp: Date.now(), data: coins};
        res.json({source: "upstream", coins});
    }catch (err){ 
        if(err.response){
            const status = err.response.status || 500;
            return res.status(status).json({error: `Upstream API error (${status})` });
        }

        res.status(500).json({error: "Failed to fetch coin data", details: err.message});
    
    }
});


app.get('/health', (req, res) => res.json({ status: 'ok'}));

app.listen(PORT, () => console.log(`Backend run on http://localhost:${PORT}`));



