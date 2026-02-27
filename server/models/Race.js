const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    round: { type: Number, required: true },
    name: { type: String, required: true }, // e.g., 'Bahrain Grand Prix'
    circuit: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['past', 'upcoming'], required: true },
    results: [
        {
            position: { type: Number },
            driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
            time: { type: String },
        }
    ],
});

module.exports = mongoose.model('Race', raceSchema);
