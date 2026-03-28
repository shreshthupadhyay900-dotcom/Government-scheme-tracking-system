const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    schemeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Scheme' },
    status: { 
        type: String, 
        enum: ['submitted', 'under review', 'approved', 'rejected'],
        default: 'submitted'
     },
    documents: [{ 
        name: { type: String },
        url: { type: String }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
