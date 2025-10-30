// Defines the API endpoints for managing tasks (chores)

const express = require('express');
const router = express.Router(); // Use Express Router to manage routes
const Task = require('../models/Task'); // Import the Mongoose Task model

// Temp hardcoding of householdId until user auth is implemented
const DEMO_HOUSEHOLD_ID = "roomsync_house_123";

// Controller functions

// @route   GET /api/tasks
// @desc    Get all tasks for a specific household
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        // Find all tasks belonging to the hardcoded household ID
        const tasks = await Task.find({ householdId: DEMO_HOUSEHOLD_ID }).sort({ createdAt: -1 });

        // Respond with the list of tasks
        res.status(200).json(tasks);

    } catch (error) {
        // Log the error and send a 500 status code
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching tasks.' });
    }
});


// @route   POST /api/tasks
// @desc    Create a new task
// @access  Public (for now)
router.post('/', async (req, res) => {
    // Extract data from the request body
    const { description, assignedTo, dueDate, frequency } = req.body;

    // Simple validation check
    if (!description || !assignedTo) {
        return res.status(400).json({ message: 'Please include a description and assigned roommate.' });
    }

    try {
        // Create a new Task instance
        const newTask = new Task({
            description,
            assignedTo,
            dueDate,
            frequency,
            householdId: DEMO_HOUSEHOLD_ID, // Assign the task to the demo household
        });

        // Save the task to the database
        const task = await newTask.save();
        
        // Respond with the newly created task (status 201 Created)
        res.status(201).json(task);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating task.' });
    }
});


// @route   PUT /api/tasks/:id
// @desc    Update an existing task (e.g., mark as complete)
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    try {
        // Find the task by ID and update it. 
        // Spread operator (...) to allow updating multiple fields from req.body
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, updatedAt: Date.now() }, 
            { new: true, runValidators: true } // 'new: true' returns the updated document, 'runValidators: true' checks schema rules
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json(updatedTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating task.' });
    }
});


// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Respond with success message and the deleted item
        res.status(200).json({ message: 'Task removed successfully.', deletedTask });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting task.' });
    }
});

module.exports = router;
