import React, { useState, useEffect } from 'react';
import { Home, ClipboardList, CheckCircle, Clock, Loader2, AlertTriangle, Calendar } from 'lucide-react';

// Define the base URL for our Express backend
const API_BASE_URL = '/api/tasks';

// Simple utility to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'No Due Date';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
};

const TaskItem = ({ task }) => (
  <div className={`p-4 mb-3 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${
    task.isCompleted 
      ? 'bg-green-50 border-l-4 border-green-500 opacity-70' 
      : 'bg-white border-l-4 border-indigo-500 hover:shadow-xl'
  }`}>
    <div className="flex justify-between items-center">
      <div className="flex-1 min-w-0">
        <p className={`text-lg font-semibold truncate ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {task.description}
        </p>
        <div className="flex items-center space-x-3 text-sm mt-1 text-gray-600">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Assigned to: <span className="font-medium text-indigo-600">{task.assignedTo}</span></span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 ml-4">
        {/* Due Date */}
        {task.dueDate && (
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(task.dueDate)}
          </span>
        )}

        {/* Status */}
        <div className={`p-2 rounded-full ${task.isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
          {task.isCompleted ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <Clock className="w-5 h-5 text-gray-700" />
          )}
        </div>
      </div>
    </div>
  </div>
);


const App = () => {
  // State for storing the list of tasks
  const [tasks, setTasks] = useState([]);
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  // Function to fetch tasks from the backend API
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError('Could not connect to backend server or fetch data. Please ensure your Express server is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook runs once after the component mounts
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array so it runs only once

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header and Welcome Message */}
        <header className="py-6 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-700 tracking-tight flex items-center justify-center">
            <Home className="w-10 h-10 mr-3 text-indigo-500" />
            DormSync
          </h1>
          <p className="mt-2 text-xl text-gray-600">Shared Household Task Manager</p>
        </header>

        {/* Main Content Area */}
        <main className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">
            <ClipboardList className="w-6 h-6 mr-2 text-indigo-500" />
            Current Chores
          </h2>

          {/* Loading, Error, or Task List */}
          {loading ? (
            <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="ml-3 text-lg text-indigo-600">Loading Tasks...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl shadow-lg flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3" />
              <p className="font-medium">{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-xl shadow-lg text-gray-500">
              <p className="text-xl">No tasks yet! Time to add some chores.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem key={task._id} task={task} />
              ))}
            </div>
          )}

          {/* Placeholder for future features */}
          <div className="mt-10 pt-6 border-t">
            <p className="text-center text-gray-500 text-sm">
              Task Form & Bill Splitting Calculator will be built here next!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
