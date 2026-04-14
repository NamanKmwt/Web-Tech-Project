const mongoose = require('mongoose');

const weatherPointSchema = new mongoose.Schema(
    {
        label: { type: String, required: true },
        condition: {
            type: String,
            enum: ['sunny', 'cloudy', 'mixed', 'rain', 'storm', 'night'],
            required: true,
        },
        airTempC: { type: Number, required: true },
        rainChancePct: { type: Number, min: 0, max: 100, required: true },
    },
    { _id: false }
);

const raceTechSchema = new mongoose.Schema(
    {
        raceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Race',
            required: true,
            unique: true,
            index: true,
        },
        roadType: {
            type: String,
            enum: ['street', 'permanent', 'hybrid'],
            required: true,
            index: true,
        },
        carType: {
            type: String,
            enum: ['high-downforce', 'low-drag', 'balanced'],
            required: true,
            index: true,
        },
        weatherNow: {
            condition: {
                type: String,
                enum: ['sunny', 'cloudy', 'mixed', 'rain', 'storm', 'night'],
                required: true,
                index: true,
            },
            airTempC: { type: Number, required: true },
            trackTempC: { type: Number, required: true },
            humidityPct: { type: Number, min: 0, max: 100, required: true },
            windKph: { type: Number, min: 0, required: true },
            rainChancePct: { type: Number, min: 0, max: 100, required: true },
        },
        weatherTrend: [weatherPointSchema],
        gripLevel: { type: Number, min: 0, max: 100, required: true },
        setupHint: { type: String, required: true },
        riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RaceTech', raceTechSchema);
