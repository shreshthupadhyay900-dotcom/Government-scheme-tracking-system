const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, income, state, occupation, category } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Sanitize numeric fields to handle empty strings or undefined from frontend
        const sanitizedAge = (age === '' || age === null || age === undefined) ? undefined : Number(age);
        const sanitizedIncome = (income === '' || income === null || income === undefined) ? undefined : Number(income);

        const user = await User.create({
            name,
            email,
            password,
            age: sanitizedAge,
            income: sanitizedIncome,
            state: state || 'All',
            occupation: occupation || 'Any',
            category: category || 'General'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                age: user.age,
                income: user.income,
                state: user.state,
                occupation: user.occupation,
                category: user.category,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                age: user.age,
                income: user.income,
                state: user.state,
                occupation: user.occupation,
                category: user.category,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, age, income, state, occupation, category } = req.body;
        if (name) user.name = name;
        if (age !== undefined) user.age = age;
        if (income !== undefined) user.income = income;
        if (state) user.state = state;
        if (occupation) user.occupation = occupation;
        if (category) user.category = category;

        await user.save();
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
};
