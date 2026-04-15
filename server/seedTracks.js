require('dotenv').config();
const mongoose = require('mongoose');
const Track = require('./models/Track');

const tracks = [
    {
        locationName: "Australia",
        nodes: {
            s1: { id: 's1', cx: 80, cy: 85, name: "Turn 1 (Jones)", color: "#DC0000", speed: "165 km/h", gear: "3rd", gForce: "3.2G", lat: -37.8504, lng: 144.9701 },
            s2: { id: 's2', cx: 30, cy: 30, name: "Lakeside Drive", color: "#52E252", speed: "305 km/h", gear: "8th", gForce: "1.1G", lat: -37.8441, lng: 144.9654 }
        }
    },
    {
        locationName: "China",
        nodes: {
            s1: { id: 's1', cx: 85, cy: 35, name: "The Snail (T1)", color: "#DC0000", speed: "95 km/h", gear: "2nd", gForce: "3.5G", lat: 31.3414, lng: 121.2197 },
            s2: { id: 's2', cx: 40, cy: 75, name: "Main Straight", color: "#52E252", speed: "320 km/h", gear: "8th", gForce: "0.9G", lat: 31.3323, lng: 121.2224 }
        }
    },
    {
        locationName: "Japan",
        nodes: {
            s1: { id: 's1', cx: 20, cy: 40, name: "First Curve", color: "#DC0000", speed: "240 km/h", gear: "6th", gForce: "4.1G", lat: 34.8456, lng: 136.5415 },
            s2: { id: 's2', cx: 85, cy: 60, name: "130R", color: "#52E252", speed: "310 km/h", gear: "8th", gForce: "4.5G", lat: 34.8436, lng: 136.5323 }
        }
    },
    {
        locationName: "Bahrain",
        nodes: {
            s1: { id: 's1', cx: 20, cy: 20, name: "Turn 1 (Schumacher)", color: "#DC0000", speed: "88 km/h", gear: "2nd", gForce: "3.8G", lat: 26.0315, lng: 50.5133 }
        }
    },
    {
        locationName: "Saudi Arabia",
        nodes: {
            s1: { id: 's1', cx: 10, cy: 90, name: "First Sector Sweep", color: "#52E252", speed: "260 km/h", gear: "6th", gForce: "4.2G", lat: 21.6319, lng: 39.1044 }
        }
    },
    {
        locationName: "USA", // Miami
        nodes: {
            s1: { id: 's1', cx: 50, cy: 10, name: "Turn 17 Hairpin", color: "#DC0000", speed: "75 km/h", gear: "1st", gForce: "2.1G", lat: 25.9525, lng: -80.2411 }
        }
    },
    {
        locationName: "Canada",
        nodes: {
            s1: { id: 's1', cx: 90, cy: 90, name: "Wall of Champions", color: "#DC0000", speed: "140 km/h", gear: "3rd", gForce: "3.0G", lat: 45.5005, lng: -73.5226 }
        }
    },
    {
        locationName: "Monaco",
        nodes: {
            s1: { id: 's1', cx: 50, cy: 60, name: "Grand Hotel Hairpin", color: "#DC0000", speed: "45 km/h", gear: "1st", gForce: "1.5G", lat: 43.7395, lng: 7.4281 }
        }
    },
    {
        locationName: "Spain", // Barcelona/Madrid - Pattern used for Barcelona
        nodes: {
            s1: { id: 's1', cx: 10, cy: 10, name: "Turn 1", color: "#FF8000", speed: "145 km/h", gear: "3rd", gForce: "3.4G", lat: 41.5714, lng: 2.2571 }
        }
    },
    {
        locationName: "Austria",
        nodes: {
            s1: { id: 's1', cx: 90, cy: 10, name: "Turn 3 (Remus)", color: "#DC0000", speed: "80 km/h", gear: "2nd", gForce: "2.9G", lat: 47.2231, lng: 14.7578 }
        }
    },
    {
        locationName: "Great Britain",
        nodes: {
            s1: { id: 's1', cx: 70, cy: 40, name: "Copse", color: "#52E252", speed: "290 km/h", gear: "8th", gForce: "5.1G", lat: 52.0733, lng: -1.0152 }
        }
    },
    {
        locationName: "Belgium",
        nodes: {
            s1: { id: 's1', cx: 15, cy: 30, name: "Eau Rouge / Raidillon", color: "#52E252", speed: "305 km/h", gear: "8th", gForce: "4.8G", lat: 50.4437, lng: 5.9720 }
        }
    },
    {
        locationName: "Hungary",
        nodes: {
            s1: { id: 's1', cx: 50, cy: 10, name: "Turn 1", color: "#DC0000", speed: "95 km/h", gear: "2nd", gForce: "3.1G", lat: 47.5841, lng: 19.2505 }
        }
    },
    {
        locationName: "Netherlands",
        nodes: {
            s1: { id: 's1', cx: 90, cy: 50, name: "Arie Luyendyk Bank", color: "#52E252", speed: "270 km/h", gear: "7th", gForce: "3.9G", lat: 52.3875, lng: 4.5422 }
        }
    },
    {
        locationName: "Italy",
        nodes: {
            s1: { id: 's1', cx: 45, cy: 10, name: "Variante del Rettifilo", color: "#DC0000", speed: "82 km/h", gear: "1st", gForce: "4.8G", lat: 45.6265, lng: 9.2828 }
        }
    },
    {
        locationName: "Azerbaijan",
        nodes: {
            s1: { id: 's1', cx: 50, cy: 50, name: "Castle Section", color: "#DC0000", speed: "80 km/h", gear: "2nd", gForce: "1.8G", lat: 40.3664, lng: 49.8333 }
        }
    },
    {
        locationName: "Singapore",
        nodes: {
            s1: { id: 's1', cx: 25, cy: 30, name: "Turn 1 (Sheares)", color: "#DC0000", speed: "112 km/h", gear: "2nd", gForce: "4.2G", lat: 1.2913, lng: 103.8637 },
            s2: { id: 's2', cx: 75, cy: 45, name: "Raffles Boulevard", color: "#52E252", speed: "318 km/h", gear: "8th", gForce: "1.1G", lat: 1.2926, lng: 103.8589 }
        }
    },
    {
        locationName: "Mexico",
        nodes: {
            s1: { id: 's1', cx: 70, cy: 75, name: "Foro Sol Stadium", color: "#DC0000", speed: "70 km/h", gear: "1st", gForce: "1.5G", lat: 19.4038, lng: -99.0886 }
        }
    },
    {
        locationName: "Brazil",
        nodes: {
            s1: { id: 's1', cx: 10, cy: 20, name: "Senna S", color: "#FF8000", speed: "110 km/h", gear: "3rd", gForce: "3.8G", lat: -23.7027, lng: -46.6976 }
        }
    },
    {
        locationName: "Las Vegas",
        nodes: {
            s1: { id: 's1', cx: 50, cy: 80, name: "The Strip", color: "#52E252", speed: "345 km/h", gear: "8th", gForce: "0.8G", lat: 36.1147, lng: -115.1728 }
        }
    },
    {
        locationName: "Qatar",
        nodes: {
            s1: { id: 's1', cx: 50, cy: 20, name: "Turn 1", color: "#FF8000", speed: "140 km/h", gear: "3rd", gForce: "3.2G", lat: 25.4900, lng: 51.4514 }
        }
    },
    {
        locationName: "Abu Dhabi",
        nodes: {
            s1: { id: 's1', cx: 90, cy: 20, name: "Yas Hotel", color: "#DC0000", speed: "90 km/h", gear: "2nd", gForce: "1.9G", lat: 24.4672, lng: 54.6031 }
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for 2026 Season Seeding...");
        await Track.deleteMany({});
        await Track.insertMany(tracks);
        console.log(`🏁 ${tracks.length} Circuits Successfully Deployed to Pit Wall!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();