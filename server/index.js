require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main DB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Models
const Driver = require('./models/Driver');
const Race = require('./models/Race');
const Article = require('./models/Article');
const RaceTech = require('./models/RaceTech');

// Routes
app.get('/api/drivers', async (req, res) => {
    try {
        const drivers = await Driver.find().sort({ points: -1 });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
});

app.get('/api/races', async (req, res) => {
    try {
        const races = await Race.find().sort({ round: 1 });
        res.json(races);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch races' });
    }
});

app.get('/api/tech/races', async (req, res) => {
    try {
        const { roadType, carType, weather, riskLevel } = req.query;
        const query = {};

        if (roadType) query.roadType = roadType;
        if (carType) query.carType = carType;
        if (weather) query['weatherNow.condition'] = weather;
        if (riskLevel) query.riskLevel = riskLevel;

        const techData = await RaceTech.find(query)
            .populate('raceId', 'round name circuit date status')
            .lean();

        techData.sort((a, b) => (a.raceId?.round || 0) - (b.raceId?.round || 0));
        res.json(techData);
    } catch (error) {
        console.error('Race tech fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch race tech data' });
    }
});

app.get('/api/tech/races/round/:round', async (req, res) => {
    try {
        const round = Number(req.params.round);
        if (!Number.isFinite(round)) {
            return res.status(400).json({ error: 'Round must be a number' });
        }

        const race = await Race.findOne({ round });
        if (!race) {
            return res.status(404).json({ error: 'Race not found for this round' });
        }

        const tech = await RaceTech.findOne({ raceId: race._id })
            .populate('raceId', 'round name circuit date status')
            .lean();

        if (!tech) {
            return res.status(404).json({ error: 'Race tech not found for this round' });
        }

        res.json(tech);
    } catch (error) {
        console.error('Race tech by round error:', error.message);
        res.status(500).json({ error: 'Failed to fetch race tech by round' });
    }
});

app.get('/api/tech/races/:raceId', async (req, res) => {
    try {
        const { raceId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(raceId)) {
            return res.status(400).json({ error: 'Invalid race ID format' });
        }

        const tech = await RaceTech.findOne({ raceId })
            .populate('raceId', 'round name circuit date status')
            .lean();

        if (!tech) {
            return res.status(404).json({ error: 'Race tech not found' });
        }

        res.json(tech);
    } catch (error) {
        console.error('Race tech by ID error:', error.message);
        res.status(500).json({ error: 'Failed to fetch race tech details' });
    }
});

app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 }).limit(10);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Fetch a single article by ID
app.get('/api/articles/:id', async (req, res) => {
    try {
        const articleId = req.params.id;

        // Find the article in your MongoDB database
        const article = await Article.findById(articleId);

        if (!article) {
            // Return a clean JSON 404 error, NOT HTML
            return res.status(404).json({ error: 'Article not found.' });
        }

        res.json(article);
    } catch (error) {
        console.error("Error fetching article by ID:", error.message);
        // This catches malformed IDs (e.g., if it's not a valid 24-character hex string)
        res.status(500).json({ error: 'Invalid ID format or internal server error' });
    }
});

// Hello endpoint
app.get('/', (req, res) => {
    res.send('F1 API Server Running');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

let f1Cache = { data: null, lastFetched: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/api/f1/current-grid', async (req, res) => {
    const now = Date.now();

    // 1. Check if we have valid cached data
    if (f1Cache.data && (now - f1Cache.lastFetched < CACHE_DURATION)) {
        console.log("Serving from Cache ⚡");
        return res.json(f1Cache.data);
    }

    try {
        console.log("Fetching fresh data from OpenF1...");

        // Use a 2025 session key as a "Stable Fallback" while we wait for 2026 race data
        // 9693 is the 2025 Abu Dhabi GP
        const sessionKey = 9693;

        const driversRes = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);

        const responseData = {
            session_name: "2025 Season Archive (Live 2026 Data coming March 6!)",
            drivers: driversRes.data
        };

        // 2. Save to Cache
        f1Cache = { data: responseData, lastFetched: now };

        res.json(responseData);
    } catch (error) {
        console.error("Backend Error:", error.message);

        // 3. Emergency Fallback: If the API is down/rate-limited, return whatever is in cache
        if (f1Cache.data) return res.json(f1Cache.data);

        res.status(error.response?.status || 500).json({ error: "F1 API is currently overloaded" });
    }
});

app.get('/api/f1/telemetry/:id', async (req, res) => {
    try {
        const driverId = req.params.id;
        const sessionKey = 9693; // Abu Dhabi fallback

        // Fetch from OpenF1
        const response = await axios.get(`https://api.openf1.org/v1/car_data?driver_number=${driverId}&session_key=${sessionKey}&speed>=300`);
        res.json(response.data);
    } catch (error) {
        console.error(`Telemetry error for driver ${req.params.id}:`, error.message);
        // If OpenF1 returns a 404 or crashes, silently return an empty array 
        // so the frontend just gracefully hides the telemetry dashboard.
        res.json([]);
    }
});

app.get('/api/test-f1', async (req, res) => {
    try {
        const response = await axios.get('https://api.openf1.org/v1/sessions?year=2026');
        res.json({
            status: "Connection Success",
            dataFound: response.data.length,
            latestSession: response.data[response.data.length - 1]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});