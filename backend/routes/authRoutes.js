const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Household = require('../models/Household');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = new User({ name, email, password });
        await user.save();

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                householdId: user.householdId
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route POST /api/auth/login
// @desc Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                householdId: user.householdId
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route POST /api/auth/create-household
// @desc Create a new household
router.post('/create-household', async (req, res) => {
    try {
        const { name, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.householdId) {
            return res.status(400).json({ message: 'User already belongs to a household' });
        }

        // Generate room code
        const roomCode = await Household.generateRoomCode();

        // Create household
        const household = new Household({
            name,
            roomCode,
            createdBy: userId,
            members: [userId]
        });
        await household.save();

        // Update user
        user.householdId = household._id;
        await user.save();

        res.status(201).json({
            household: {
                id: household._id,
                name: household.name,
                roomCode: household.roomCode
            }
        });
    } catch (error) {
        console.error('Create household error:', error);
        res.status(500).json({ message: 'Server error creating household' });
    }
});

// @route POST /api/auth/join-household
// @desc Join a household with room code
router.post('/join-household', async (req, res) => {
    try {
        const { roomCode, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.householdId) {
            return res.status(400).json({ message: 'User already belongs to a household' });
        }

        const household = await Household.findOne({ roomCode: roomCode.toUpperCase() });
        if (!household) {
            return res.status(404).json({ message: 'Invalid room code' });
        }

        // Add user to household
        household.members.push(userId);
        await household.save();

        // Update user
        user.householdId = household._id;
        await user.save();

        res.json({
            household: {
                id: household._id,
                name: household.name,
                roomCode: household.roomCode
            }
        });
    } catch (error) {
        console.error('Join household error:', error);
        res.status(500).json({ message: 'Server error joining household' });
    }
});

// @route GET /api/auth/me
// @desc Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).populate('householdId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                householdId: user.householdId
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;