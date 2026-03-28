const Application = require('../models/Application');
const Scheme = require('../models/Scheme');

const submitApplication = async (req, res) => {
    try {
        const { schemeId } = req.body;

        // Check if scheme exists
        const scheme = await Scheme.findById(schemeId);
        if (!scheme) {
            return res.status(404).json({ message: 'Scheme not found' });
        }

        // Check if application already exists
        const existingApp = await Application.findOne({ userId: req.user.id, schemeId });
        if (existingApp) {
            return res.status(400).json({ message: 'Application already submitted for this scheme' });
        }

        // Handle uploaded documents (dummy mapping here since we are not using cloudinary fully yet)
        const documents = req.files ? req.files.map(file => ({
            name: file.originalname,
            url: file.path // In production, this would be Cloudinary URL
        })) : [];

        const application = await Application.create({
            userId: req.user.id,
            schemeId,
            documents
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id }).populate('schemeId', 'name description');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitApplication,
    getUserApplications,
    updateApplicationStatus
};
