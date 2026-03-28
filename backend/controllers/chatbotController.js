const Scheme = require('../models/Scheme');

const getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const msgLower = message.toLowerCase();
        let matchedSchemes = [];
        
        // Intelligent Keyword Mapping
        const keywordMap = {
            'student': ['student', 'scholarship', 'education', 'study'],
            'farmer': ['farmer', 'agriculture', 'agriculture', 'kisan'],
            'women': ['women', 'girl', 'female', 'mother', 'lady', 'kanyashree'],
            'entrepreneur': ['startup', 'business', 'entrepreneur', 'industry'],
            'international': ['international', 'abroad', 'uk', 'usa', 'scholarship', 'study outside'],
            'west bengal': ['west bengal', 'bengal', 'wb'],
            'telangana': ['telangana', 'hyderabad'],
            'madhya pradesh': ['madhya pradesh', 'mp'],
            'andhra pradesh': ['andhra pradesh', 'ap']
        };

        // Semantic Analysis
        let searchFields = [];
        for (const [key, aliases] of Object.entries(keywordMap)) {
            if (aliases.some(alias => msgLower.includes(alias))) {
                searchFields.push(key);
            }
        }

        if (searchFields.length > 0) {
            matchedSchemes = await Scheme.find({
                $or: [
                    { 'eligibility.occupation': { $in: searchFields.map(f => new RegExp(f, 'i')) } },
                    { 'eligibility.state': { $in: searchFields.map(f => new RegExp(f, 'i')) } },
                    { 'name': { $regex: new RegExp(msgLower.split(' ').join('|'), 'i') } },
                    { 'description': { $regex: new RegExp(msgLower.split(' ').join('|'), 'i') } }
                ]
            }).limit(5);
        } else {
            // Fallback for general queries
            matchedSchemes = await Scheme.find({
                $or: [
                    { 'name': { $regex: new RegExp(msgLower.split(' ').join('|'), 'i') } },
                    { 'description': { $regex: new RegExp(msgLower.split(' ').join('|'), 'i') } }
                ]
            }).limit(3);
        }

        if (matchedSchemes.length > 0) {
            return res.status(200).json({
                reply: `I've analyzed your request and identified ${matchedSchemes.length} matching policy frameworks. Our intelligence engines suggest these might be optimal for your profile.`,
                schemes: matchedSchemes
            });
        }

        res.status(200).json({ 
            reply: "The intelligence matrix couldn't find a high-resonance match in our current repositories. However, you can explore the 'Omni Channel' section in Schemes for all active policies.",
            schemes: []
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChatbotResponse
};
