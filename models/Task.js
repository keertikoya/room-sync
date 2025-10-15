// Mongoose Schema and Model

const mongoose = require('mongoose');

// Define the schema
const taskSchema = new mongoose.Schema({
    // The description of the task (e.g., "Clean the kitchen counter")
    description: {
        type: String,
        required: [true, 'A task description is required.'],
        trim: true,
        maxlength: 200 // Prevent overly long descriptions
    },

    // The unique ID of the household this task belongs to (for shared login)
    householdId: {
        type: String, 
        required: true,
    },

    // Who the task is assigned to
    assignedTo: {
        type: String,
        required: [true, 'The task must be assigned to a roommate.'],
        // Temporary: hold a user's name/ID
    },

    // The date the task needs to be completed by
    dueDate: {
        type: Date,
        required: false, // Optional if it's a recurring task
    },

    // Status flag to track if the task is pending or complete
    isCompleted: {
        type: Boolean,
        default: false, // Tasks start as incomplete
    },

    // How often the task recurs (e.g., 'weekly', 'daily', 'monthly')
    frequency: {
        type: String,
        enum: ['once', 'daily', 'weekly', 'monthly'],
        default: 'once',
    },

    // Date the task was completed (for tracking history)
    completedAt: {
        type: Date,
        required: false,
    },
}, {
    // adds 'createdAt' and 'updatedAt' fields automatically
    timestamps: true 
});

// Create and export the model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
