const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., 'max-verstappen'
    name: { type: String, required: true },
    number: { type: Number, required: true },
    team: { type: String, required: true },
    nationality: { type: String, required: true },
    points: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    podiums: { type: Number, default: 0 },
    imageUrl: { type: String }, // URL or path to high-res image
});

module.exports = mongoose.model('Driver', driverSchema);
