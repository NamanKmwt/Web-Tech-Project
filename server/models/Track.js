// 1. ADD THIS LINE AT THE TOP!
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    locationName: { type: String, required: true, unique: true }, 
    svgPath: { type: String, required: true },
    nodes: { type: Object, required: true }
});

// 2. EXPORT THE MODEL
module.exports = mongoose.model('Track', trackSchema);