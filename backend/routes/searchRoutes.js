const express = require('express');
const router = express.Router();
const { semanticSearch } = require('../services/semanticSearch');

// POST /api/search/semantic
router.post('/semantic', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || !query.trim()) return res.status(400).json({ message: 'Query is required' });
        const results = await semanticSearch(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
