const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
        default: ''
    },
    extractedData: {
        name: { type: String, default: '' },
        income: { type: Number, default: 0 },
        idNumbers: { type: [String], default: [] },
        isComplete: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
