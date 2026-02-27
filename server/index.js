require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

app.get('/api/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 }).limit(10);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Hello endpoint
app.get('/', (req, res) => {
    res.send('F1 API Server Running');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
