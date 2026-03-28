const { getRecommendations } = require('../services/recommendationService');

const getSchemeRecommendations = async (req, res) => {
    try {
        const profile = req.body;

        const requiredFields = ['age', 'income', 'state', 'occupation', 'category'];
        const missing = requiredFields.filter(f => profile[f] === undefined || profile[f] === '');
        if (missing.length > 0) {
            return res.status(400).json({ message: `Missing fields: ${missing.join(', ')}` });
        }

        const results = await getRecommendations(profile);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSchemeRecommendations };
