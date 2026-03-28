const mongoose = require('mongoose');

const schemeSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['health', 'education', 'agriculture', 'housing', 'employment', 'women', 'insurance', 'startup', 'pension', 'skill'], default: 'employment' },
    description: { type: String, required: true },
    eligibility: {
        minAge: { type: Number, default: 0 },
        maxAge: { type: Number, default: 100 },
        maxIncome: { type: Number, default: 999999999 },
        gender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
        occupation: { type: String, default: 'All' },
        state: { type: String, default: 'All' },
        category: { type: String, default: 'All' },
    },
    benefits: { type: String, required: true },
    requiredDocs: { type: [String], default: [] },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    priorityScore: { type: Number, default: 5, min: 1, max: 10 },
    successRate: { type: Number, default: 70 },
    avgProcessingTime: { type: String, default: '30 days' },
    tags: { type: [String], default: [] },
    applicationMode: { type: String, enum: ['online', 'offline', 'both'], default: 'both' },
    requiredDocs: { type: [String], default: [] },
}, {
    timestamps: true
});

module.exports = mongoose.model('Scheme', schemeSchema);
