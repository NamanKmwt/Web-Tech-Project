require('dotenv').config();
const mongoose = require('mongoose');
const Driver = require('./models/Driver');
const Article = require('./models/Article');

const driversData = [
    {
        id: 'max-verstappen',
        name: 'Max Verstappen',
        number: 1,
        team: 'Red Bull Racing',
        nationality: 'Dutch',
        points: 400,
        wins: 10,
        podiums: 15,
        imageUrl: '/images/drivers/max.png',
    },
    {
        id: 'lewis-hamilton',
        name: 'Lewis Hamilton',
        number: 44,
        team: 'Ferrari',
        nationality: 'British',
        points: 340,
        wins: 5,
        podiums: 12,
        imageUrl: '/images/drivers/lewis.png',
    },
    {
        id: 'charles-leclerc',
        name: 'Charles Leclerc',
        number: 16,
        team: 'Ferrari',
        nationality: 'Monegasque',
        points: 320,
        wins: 4,
        podiums: 10,
        imageUrl: '/images/drivers/charles.png',
    },
];

const articlesData = [
    {
        title: 'New Era of Racing: 2026 Regulations Revealed',
        excerpt: 'A deep dive into the aerodynamic and power unit changes coming to Formula 1.',
        content: 'Full article content here...',
        category: 'Tech',
        imageUrl: '/images/tech.png'
    },
    {
        title: 'Hamilton to Ferrari: The Ultimate Challenge',
        excerpt: 'Seven-time world champion begins a new chapter at Maranello.',
        content: 'Full article content here...',
        category: 'News',
        imageUrl: '/images/news1.png'
    },
    {
        title: 'Aerodynamics Explained: The Ground Effect',
        excerpt: 'How underfloor tunnels produce massive downforce at high speeds.',
        content: 'Full article content here...',
        category: 'Tech',
        imageUrl: '/images/hero.png'
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB. Seeding data...');

        // Clear existing
        await Driver.deleteMany({});
        await Article.deleteMany({});

        // Insert new
        await Driver.insertMany(driversData);
        await Article.insertMany(articlesData);

        console.log('🏁 Seeding complete!');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error for Seeding:', err);
        process.exit(1);
    });
