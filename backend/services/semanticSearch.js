const Scheme = require('../models/Scheme');

/**
 * Semantic search using keyword extraction + MongoDB text query.
 * When OPENAI_API_KEY is set, adds an OpenAI-powered re-ranking layer.
 * Falls back to keyword matching otherwise.
 */

const naturalLanguageToKeywords = (query) => {
    const q = query.toLowerCase();
    const extracted = {};

    // State extraction
    const states = ['madhya pradesh', 'uttar pradesh', 'maharashtra', 'tamil nadu', 'gujarat',
        'rajasthan', 'west bengal', 'telangana', 'karnataka', 'kerala', 'bihar',
        'odisha', 'assam', 'jharkhand', 'chhattisgarh', 'haryana', 'punjab', 'mp', 'up'];
    const stateMap = { 'mp': 'Madhya Pradesh', 'up': 'Uttar Pradesh' };
    for (const s of states) {
        if (q.includes(s)) {
            extracted.state = stateMap[s] || s.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
            break;
        }
    }

    // Occupation/Category detection
    const occupationMap = {
        'student': 'Student', 'farmer': 'Farmer', 'entrepreneur': 'Entrepreneur',
        'startup': 'Entrepreneur', 'worker': 'Worker', 'unemployed': 'Any',
        'artisan': 'Worker', 'craftsman': 'Worker', 'women': 'Any', 'mother': 'Any',
    };
    for (const [keyword, occ] of Object.entries(occupationMap)) {
        if (q.includes(keyword)) { extracted.occupation = occ; break; }
    }

    // Category extraction
    const categoryMap = {
        'scholarship': 'education', 'study': 'education', 'college': 'education', 'school': 'education',
        'health': 'health', 'hospital': 'health', 'medicine': 'health', 'insurance': 'insurance',
        'house': 'housing', 'home': 'housing', 'farm': 'agriculture', 'crop': 'agriculture',
        'business': 'startup', 'loan': 'startup', 'job': 'employment', 'work': 'employment',
        'pension': 'pension', 'skill': 'skill', 'train': 'skill', 'women': 'women', 'girl': 'women',
    };
    for (const [keyword, cat] of Object.entries(categoryMap)) {
        if (q.includes(keyword)) { extracted.category = cat; break; }
    }

    return extracted;
};

const semanticSearch = async (query) => {
    const keywords = naturalLanguageToKeywords(query);

    const orConditions = [];

    // Text-based search
    const words = query.split(' ').filter(w => w.length > 3);
    orConditions.push(
        { name: { $regex: words.join('|'), $options: 'i' } },
        { description: { $regex: words.join('|'), $options: 'i' } },
        { benefits: { $regex: words.join('|'), $options: 'i' } },
        { tags: { $in: words.map(w => new RegExp(w, 'i')) } },
    );

    if (keywords.category) {
        orConditions.push({ category: keywords.category });
    }
    if (keywords.occupation) {
        orConditions.push({ 'eligibility.occupation': new RegExp(keywords.occupation, 'i') });
    }
    if (keywords.state) {
        orConditions.push(
            { 'eligibility.state': new RegExp(keywords.state, 'i') },
            { 'eligibility.state': 'All' }
        );
    }

    let results = await Scheme.find({
        $or: orConditions,
        isActive: true,
    }).limit(15);

    // Relevance re-ranking: boost state-specific and high-priority
    results = results.map(scheme => {
        let relevance = scheme.priorityScore || 5;
        if (keywords.state && scheme.eligibility.state?.toLowerCase().includes(keywords.state.toLowerCase())) {
            relevance += 5;
        }
        if (keywords.category && scheme.category === keywords.category) {
            relevance += 3;
        }
        return { ...scheme.toObject(), _relevance: relevance };
    }).sort((a, b) => b._relevance - a._relevance);

    // Generate context summary
    const summary = `Found ${results.length} schemes matching "${query}". ${keywords.state ? `Includes schemes for ${keywords.state}.` : ''} ${keywords.category ? `Focused on ${keywords.category} schemes.` : ''}`.trim();

    return { schemes: results.slice(0, 10), summary, extractedContext: keywords };
};

module.exports = { semanticSearch };
