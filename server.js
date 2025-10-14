const express = require('express');
// For cross-port communication
const cors = require('cors');
const app = express();
// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());
// Initialize the Express application
app.use(express.json());

// Simple root route for testing
app.get('/', (req, res) => {
    // Send a JSON response back to the client
    res.json({ message: "DormSync Server is running!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});