const Scheme = require('../models/Scheme');

/**
 * Weighted AI Recommendation Engine
 * Scoring rubric (total 100 points):
 *  Age Match         → 20 pts
 *  Income Match      → 25 pts
 *  State Match       → 15 pts
 *  Occupation Match  → 15 pts
 *  Category Match    → 10 pts
 *  Document Match    → 10 pts
 *  Priority Score    →  5 pts
 */

const scoreScheme = (scheme, profile) => {
    let score = 0;
    const reasons = [];
    const missingDocs = [];

    const { age, income, state, occupation, gender, category, uploadedDocuments = [] } = profile;

    // 1. AGE MATCH (+20)
    const minAge = scheme.eligibility.minAge || 0;
    const maxAge = scheme.eligibility.maxAge || 100;
    if (age >= minAge && age <= maxAge) {
        score += 20;
        reasons.push(`Age ${age} matches eligibility (${minAge}–${maxAge} yrs)`);
    } else {
        reasons.push(`Age ${age} is outside range (${minAge}–${maxAge} yrs)`);
    }

    // 2. INCOME MATCH (+25)
    const maxIncome = scheme.eligibility.maxIncome;
    if (!maxIncome || income <= maxIncome) {
        score += 25;
        reasons.push(`Income ₹${income?.toLocaleString()} is within limit`);
    } else {
        reasons.push(`Income exceeds scheme limit of ₹${maxIncome?.toLocaleString()}`);
    }

    // 3. STATE MATCH (+15)
    const schemeState = (scheme.eligibility.state || 'All').toLowerCase();
    if (schemeState === 'all' || schemeState === state?.toLowerCase()) {
        const isNational = schemeState === 'all';
        score += isNational ? 10 : 15; // Extra 5 for state-specific boost
        reasons.push(isNational ? 'National scheme (all states eligible)' : `State-specific match: ${scheme.eligibility.state}`);
    } else {
        reasons.push(`Scheme is for ${scheme.eligibility.state} only (you are in ${state})`);
    }

    // 4. OCCUPATION MATCH (+15)
    const schemeOcc = (scheme.eligibility.occupation || 'All').toLowerCase();
    const userOcc = (occupation || '').toLowerCase();
    if (schemeOcc === 'all' || userOcc.includes(schemeOcc) || schemeOcc.includes(userOcc)) {
        score += 15;
        reasons.push(`Occupation "${occupation}" matches scheme requirement`);
    } else {
        reasons.push(`Scheme requires "${scheme.eligibility.occupation}" occupation`);
    }

    // 5. CATEGORY MATCH (+10)
    const schemeCat = (scheme.eligibility.category || 'All').toLowerCase();
    const userCat = (category || '').toLowerCase();
    if (schemeCat === 'all' || schemeCat === 'any' || userCat === schemeCat) {
        score += 10;
        reasons.push(`Category "${category}" qualifies`);
    } else {
        reasons.push(`Scheme requires "${scheme.eligibility.category}" category`);
    }

    // 6. GENDER MATCH (bonus, replaces nothing but reduces final if mismatch)
    const schemeGender = (scheme.eligibility.gender || 'any').toLowerCase();
    const userGender = (gender || 'any').toLowerCase();
    if (schemeGender !== 'any' && schemeGender !== userGender && userGender !== 'any') {
        score = Math.max(0, score - 15);
        reasons.push(`Gender mismatch (scheme for ${scheme.eligibility.gender} only)`);
    }

    // 7. DOCUMENT MATCH (+10)
    const requiredDocs = scheme.requiredDocs || [];
    if (requiredDocs.length === 0) {
        score += 10;
    } else {
        const userDocs = uploadedDocuments.map(d => d.toLowerCase());
        const matched = requiredDocs.filter(doc => userDocs.some(ud => ud.includes(doc.toLowerCase())));
        const missing = requiredDocs.filter(doc => !userDocs.some(ud => ud.includes(doc.toLowerCase())));
        missingDocs.push(...missing);
        const docScore = Math.round((matched.length / requiredDocs.length) * 10);
        score += docScore;
        if (missing.length > 0) reasons.push(`Missing docs: ${missing.join(', ')}`);
        else reasons.push(`All required documents available`);
    }

    // 8. PRIORITY SCORE BONUS (+5)
    const priorityBonus = Math.round(((scheme.priorityScore || 5) / 10) * 5);
    score += priorityBonus;

    // 9. SUCCESS rate adjustment
    const successBonus = Math.round(((scheme.successRate || 70) / 100) * 3);
    score += successBonus;

    // Clamp to 100
    score = Math.min(100, score);

    // Eligibility classification
    let eligibilityStatus;
    if (score >= 80) eligibilityStatus = 'eligible';
    else if (score >= 50) eligibilityStatus = 'partially eligible';
    else eligibilityStatus = 'not eligible';

    // Human-readable reason
    const primaryReasons = reasons.filter(r => !r.includes('missing') && !r.includes('mismatch') && !r.includes('outside') && !r.includes('exceeds') && !r.includes('requires'));
    const issues = reasons.filter(r => r.includes('missing') || r.includes('mismatch') || r.includes('outside') || r.includes('exceeds') || r.includes('requires'));

    let readableReason = primaryReasons.slice(0, 2).join('. ');
    if (issues.length > 0) readableReason += `. Note: ${issues[0]}.`;
    if (missingDocs.length > 0) readableReason += ` Missing: ${missingDocs.join(', ')}.`;

    return {
        schemeName: scheme.name,
        schemeId: scheme._id,
        category: scheme.category,
        score,
        eligibilityStatus,
        reason: readableReason || 'Matches your profile.',
        missingDocs,
        benefits: scheme.benefits,
        tags: scheme.tags,
        applicationMode: scheme.applicationMode,
        successRate: scheme.successRate,
        avgProcessingTime: scheme.avgProcessingTime,
        priorityScore: scheme.priorityScore,
        successProbability: computeSuccessProbability(score, scheme),
        riskLevel: computeRiskLevel(score),
    };
};

const computeSuccessProbability = (matchScore, scheme) => {
    const base = (scheme.successRate || 70) / 100;
    const matchFactor = matchScore / 100;
    return Math.round((base * 0.6 + matchFactor * 0.4) * 100);
};

const computeRiskLevel = (score) => {
    if (score >= 80) return 'low';
    if (score >= 50) return 'medium';
    return 'high';
};

const getRecommendations = async (profile) => {
    const schemes = await Scheme.find({ isActive: true });

    const scored = schemes.map(scheme => scoreScheme(scheme, profile));
    scored.sort((a, b) => b.score - a.score);

    return {
        topRecommendations: scored.slice(0, 10),
        eligible: scored.filter(s => s.eligibilityStatus === 'eligible'),
        partial: scored.filter(s => s.eligibilityStatus === 'partially eligible'),
        totalAnalyzed: schemes.length,
    };
};

module.exports = { getRecommendations, scoreScheme };
