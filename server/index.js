require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;
const Track = require('./models/Track'); 

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

// ==========================================
// MONGODB ROUTES (Internal Database)
// ==========================================

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

app.get('/api/articles/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);

        if (!article) {
            return res.status(404).json({ error: 'Article not found.' });
        }

        res.json(article);
    } catch (error) {
        console.error("Error fetching article by ID:", error.message);
        res.status(500).json({ error: 'Invalid ID format or internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('F1 API Server Running');
});

// ==========================================
// EXTERNAL API ROUTES (Wikipedia & OpenF1)
// ==========================================

// Get Driver Biography (Wikipedia)
// ==========================================
// ENDPOINT: Get Driver Biography (Wikipedia)
// ==========================================
app.get('/api/f1/bio/:name', async (req, res) => {
    try {
        const rawName = req.params.name;
        console.log(`🔍 Attempting to fetch bio for: "${rawName}"`);

        // 1. Fix the ALL CAPS last name issue (e.g., "Lewis HAMILTON" -> "Lewis Hamilton")
        const titleCaseName = rawName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // 2. Wikipedia Exception Dictionary (Using Title Case keys now)
        const wikiExceptions = {
            "Carlos Sainz": "Carlos_Sainz_Jr.",
            "Sergio Perez": "Sergio_Pérez",
            "Nico Hulkenberg": "Nico_Hülkenberg",
            "Zhou Guanyu": "Zhou_Guanyu",
            "Guanyu Zhou": "Zhou_Guanyu",
            "Kimi Antonelli": "Andrea_Kimi_Antonelli"
        };

        // Format for Wikipedia URL
        let wikiName = wikiExceptions[titleCaseName] || titleCaseName.replace(/\s+/g, '_');
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiName)}`;

        // 3. Add the User-Agent header (This fixes the 403 Forbidden error!)
        const response = await axios.get(wikiUrl, {
            headers: {
                'User-Agent': 'F1WebProjectApp/1.0 (your-email@example.com)' 
            }
        });

        if (response.data.type === "disambiguation") {
            throw new Error("Wikipedia returned a disambiguation page.");
        }

        res.json({ 
            bio: response.data.extract,
            sourceUrl: response.data.content_urls?.desktop?.page
        });
        
    } catch (error) {
        // We look at error.response.status to give you better debugging logs
        const status = error.response ? error.response.status : 'Unknown';
        console.error(`❌ Bio error [Status ${status}] for ${req.params.name}:`, error.message);
        
        res.json({ 
            bio: "Biography currently unavailable.",
            sourceUrl: null
        });
    }
});
// Ensure you have these required at the top of your file
// const Track = require('./models/Track');
// const axios = require('axios');

// ==========================================
// ENDPOINT: Get Track Details (OpenF1 + MongoDB)
// ==========================================
app.get('/api/f1/track-info/:locationName', async (req, res) => {
    try {
        const rawLocation = req.params.locationName;
        
        // 1. FORMAT NAME: "united states" -> "United States"
        const location = rawLocation.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        console.log(`📡 Fetching data for: ${location}`);

        // 2. FETCH DATA (Parallel for speed)
        const [trackMapData, openF1Response] = await Promise.all([
            Track.findOne({ locationName: location }),
            axios.get(`https://api.openf1.org/v1/meetings?year=2026&country_name=${location}`)
        ]);

        // 3. GENERATE THE CARBON ICON URL
        // Formula 1 uses a predictable pattern: [Country]%20carbon.png
        const trackIconUrl = `https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${location.replace(' ', '%20')}%20carbon.png`;

        let officialName = location;
        if (openF1Response.data && openF1Response.data.length > 0) {
            officialName = openF1Response.data[0].meeting_official_name || location;
        }

        res.json({
            circuitName: officialName,
            trackIconUrl: trackIconUrl,
            mapData: trackMapData ? {
                svgPath: trackMapData.svgPath,
                nodes: trackMapData.nodes
            } : null
        });

    } catch (error) {
        console.error(`❌ Track info error:`, error.message);
        res.status(500).json({ error: "Failed to sync track data." });
    }
});

// Caching setup for OpenF1
let f1Cache = { data: null, lastFetched: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/api/f1/current-grid', async (req, res) => {
    const now = Date.now();

    if (f1Cache.data && (now - f1Cache.lastFetched < CACHE_DURATION)) {
        console.log("Serving from Cache ⚡");
        return res.json(f1Cache.data);
    }

    try {
        console.log("Fetching fresh data from OpenF1...");
        const sessionKey = 9693; // 2025 Abu Dhabi fallback
        const driversRes = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);

        const responseData = {
            session_name: "2025 Season Archive (Live 2026 Data coming March 6!)",
            drivers: driversRes.data
        };

        f1Cache = { data: responseData, lastFetched: now };
        res.json(responseData);
    } catch (error) {
        console.error("Backend Error:", error.message);
        if (f1Cache.data) return res.json(f1Cache.data);
        res.status(error.response?.status || 500).json({ error: "F1 API is currently overloaded" });
    }
});

app.get('/api/f1/telemetry/:id', async (req, res) => {
    try {
        const driverId = req.params.id;
        const sessionKey = 9693; // Abu Dhabi fallback

        const response = await axios.get(`https://api.openf1.org/v1/car_data?driver_number=${driverId}&session_key=${sessionKey}&speed>=300`);
        res.json(response.data);
    } catch (error) {
        console.error(`Telemetry error for driver ${req.params.id}:`, error.message);
        res.json([]);
    }
});

app.get('/api/f1/current-teams', async (req, res) => {
    try {
        let response = await fetch('https://api.openf1.org/v1/championship_teams?session_key=latest');
        let data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            console.log("No points found in latest session, falling back to 9839...");
            response = await fetch('https://api.openf1.org/v1/championship_teams?session_key=9839');
            data = await response.json();
        }

        if (!Array.isArray(data)) {
            console.error("OpenF1 returned invalid data:", data);
            return res.json([]); 
        }

        const uniqueTeams = data.reduce((acc, current) => {
            const exists = acc.find(item => item.team_name === current.team_name);
            if (!exists) return acc.concat([current]);
            return acc;
        }, []);

        const sortedTeams = uniqueTeams.sort((a, b) => a.position_current - b.position_current);
        res.json(sortedTeams);
    } catch (error) {
        console.error("Constructors Fetch Error:", error);
        res.status(500).json({ error: 'Failed to fetch team standings' });
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

// ==========================================
// SERVER STARTUP
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});