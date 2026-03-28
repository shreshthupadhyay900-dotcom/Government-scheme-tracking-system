const Scheme = require('../models/Scheme');

const getSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find({});
        res.status(200).json(schemes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createScheme = async (req, res) => {
    try {
        const { name, description, eligibility, benefits, deadline } = req.body;

        if (!name || !description || !benefits) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const scheme = await Scheme.create({
            name,
            description,
            eligibility,
            benefits,
            deadline
        });

        res.status(201).json(scheme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkEligibility = async (req, res) => {
    try {
        const { age, income, state, occupation, category } = req.body;
        
        const schemes = await Scheme.find({});
        const eligibleSchemes = [];
        const notEligibleSchemes = [];

        schemes.forEach((scheme) => {
            let isEligible = true;
            let reasons = [];

            if (scheme.eligibility.minAge && age < scheme.eligibility.minAge) {
                isEligible = false;
                reasons.push(`Minimum age required is ${scheme.eligibility.minAge}`);
            }

            if (scheme.eligibility.maxIncome && income > scheme.eligibility.maxIncome) {
                isEligible = false;
                reasons.push(`Maximum income allowed is ${scheme.eligibility.maxIncome}`);
            }

            if (scheme.eligibility.state && scheme.eligibility.state !== 'All' && state && state !== scheme.eligibility.state) {
                isEligible = false;
                reasons.push(`Available only in ${scheme.eligibility.state}`);
            }

            if (scheme.eligibility.occupation && scheme.eligibility.occupation !== 'All' && occupation && occupation !== scheme.eligibility.occupation) {
                isEligible = false;
                reasons.push(`Available only for ${scheme.eligibility.occupation}`);
            }

            if (scheme.eligibility.category && scheme.eligibility.category !== 'All' && category && category !== scheme.eligibility.category) {
                isEligible = false;
                reasons.push(`Available only for ${scheme.eligibility.category} category`);
            }

            if (isEligible) {
                eligibleSchemes.push(scheme);
            } else {
                notEligibleSchemes.push({ scheme, reasons });
            }
        });

        res.status(200).json({
            eligible: eligibleSchemes,
            notEligible: notEligibleSchemes
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { generateGuide } = require('../services/applicationService');

const getSchemeById = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSchemeGuide = async (req, res) => {
    try {
        const scheme = await Scheme.findById(req.params.id);
        if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

        const guide = await generateGuide(scheme, req.user);
        res.status(200).json(guide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSchemes,
    createScheme,
    checkEligibility,
    getSchemeById,
    getSchemeGuide
};
