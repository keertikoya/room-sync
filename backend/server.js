const express = require('express');
// For cross-port communication
const cors = require('cors');
// Import Mongoose for database connectivity
const mongoose = require('mongoose'); 
// Import the Task router
const taskRoutes = require('./routes/taskRoutes');
// Initialize the Express application
const app = express();
// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

const MONGO_URI = 'mongodb://localhost:27017/dormsyc_db'; 

// Database connection
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using Mongoose
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails, log the error and exit the process
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure code
        process.exit(1); 
    }
};

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Simple root route for testing
app.get('/', (req, res) => {
    res.json({ message: "RoomSync Server is running and ready for API routes" });
});

// Link the task router to the /api/tasks endpoint
app.use('/api/tasks', taskRoutes);

// Start the server after connecting to the database
connectDB().then(() => {
    app.listen(PORT, () => {
        // Logged to Node.js console
        console.log(`Server is listening on port ${PORT}`);
    });
});