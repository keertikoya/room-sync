# RoomSync - Household Task & Bill Management System

This is a full-stack MERN (MongoDB, Express.js, React, and Node.js) application created to simplify how roommates coordinate household responsibilities. After experiencing firsthand the mess of alternating chores and tracking shared costs in a college apartment, I built this platform to provide a structured way to manage tasks, log shared purchases, and split expenses accurately. The app delivers a clean, intuitive interface for keeping everyone on the same page and simplifying shared living.

![RoomSync Banner](https://img.shields.io/badge/MERN-Stack-success)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-22.x-brightgreen)

## Features

### Task Management
- **Create Tasks**: Add household chores with descriptions, assignees, and due dates
- **Edit Tasks**: Update task details inline with a clean edit interface
- **Complete Tasks**: Mark tasks as done with visual feedback
- **Delete Tasks**: Remove tasks with confirmation dialogs
- **Smart Sorting**: Automatically sorts incomplete tasks first, then by due date
- **Assignment System**: Assign tasks to specific roommates

### Bill Splitting Calculator
- **Split Bills**: Calculate how much each person owes
- **Bill Descriptions**: Track what each bill is for
- **Flexible Splitting**: Select who should contribute to each bill
- **Real-time Calculations**: Instant breakdown of costs per person
- **Visual Breakdown**: Clear display of who owes whom

### Technical Features
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Instant UI feedback on all actions
- **Data Validation**: Client and server-side validation
- **Multi-tenant Architecture**: Support for multiple households
- **RESTful API**: Clean, standard API endpoints

## Tech Stack

### Frontend
- **React** 18.2 - UI library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon set
- **Fetch API** - HTTP requests

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 5.1 - Web framework
- **MongoDB** 7.0 - NoSQL database
- **Mongoose** 8.19 - MongoDB ODM
- **CORS** - Cross-origin resource sharing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v7.0 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone 
cd RoomSync
```

### 2. Set Up MongoDB
```bash
# Start MongoDB (macOS)
/usr/local/mongodb/bin/mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork

# Verify MongoDB is running
mongosh
```

### 3. Set Up Backend
```bash
cd backend
npm install
node server.js
```

The backend will run on `http://localhost:5000`

### 4. Set Up Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`
