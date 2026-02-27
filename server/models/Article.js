const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String },
    category: { type: String, default: 'News' }, // 'Tech', 'Analysis', 'News'
    imageUrl: { type: String }, // Large banner image
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
