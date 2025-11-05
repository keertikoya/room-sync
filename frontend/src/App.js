import React, { useState, useEffect } from 'react';
import { 
  Home, ClipboardList, CheckCircle, Clock, Loader2, AlertTriangle, Calendar, Plus, User, Send, Check, X
} from 'lucide-react';

// Define the base URL for our Express backend
const API_BASE_URL = '/api/tasks';

// A simple utility to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return 'No Due Date';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });
};

// TaskItem Component
const TaskItem = ({ task, onToggleComplete, onDelete }) => (
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

        {/* Status Button */}
        <button
          onClick={() => onToggleComplete(task._id)}
          className={`p-2 rounded-full transition-all hover:scale-110 ${
            task.isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          title={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.isCompleted ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <Clock className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-all hover:scale-110"
          title="Delete task"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  </div>
);

// AddTaskForm Component
const AddTaskForm = ({ onTaskAdded }) => {
  const [taskData, setTaskData] = useState({
    description: '',
    assignedTo: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Hardcoded roommate options for now
  const roommates = ['Alex', 'Beatrice', 'Carmen', 'Denise'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.description || !taskData.assignedTo) {
        setSubmitError("Description and Roommate are required.");
        return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
        ...taskData,
        dueDate: taskData.dueDate || null, 
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Clear the form and notify parent to refresh
      setTaskData({ description: '', assignedTo: '', dueDate: '' });
      onTaskAdded(); 

    } catch (err) {
      console.error("Error creating task:", err);
      setSubmitError(`Failed to create task: ${err.message}. Check server logs.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl shadow-inner">
      <h3 className="text-xl font-bold text-indigo-700 mb-4 flex items-center">
        <Plus className="w-5 h-5 mr-2" />
        Add New Chore
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Chore Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="e.g., Clean kitchen counter & sink"
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assign To</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={taskData.assignedTo}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm p-3 pl-10 focus:border-indigo-500 focus:ring-indigo-500 appearance-none"
                >
                  <option value="" disabled>Select Roommate</option>
                  {roommates.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
        </div>

        {submitError && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white transition duration-150 ease-in-out ${
            isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Adding Task...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Add Chore to List
            </>
          )}
        </button>
      </form>
    </div>
  );
};


// App Component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
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
      
      // Sort tasks: Incomplete tasks first, then by due date
      const sortedTasks = data.sort((a, b) => {
        // First: Incomplete tasks first
        if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
        }
        // Second: By due date (null/undefined dates go last)
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      });

      setTasks(sortedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError('Could not connect to backend server or fetch data. Please ensure your Express server is running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle task completion
  const toggleTaskComplete = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the task list
      fetchTasks();
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
  if (!window.confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Refresh the task list
    fetchTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
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
            RoomSync
          </h1>
          <p className="mt-2 text-xl text-gray-600">Shared Household Task Manager</p>
        </header>

        {/* Main Content Area */}
        <main className="mt-8">

          {/* Task Creation Form */}
          <div className="mb-10">
              <AddTaskForm onTaskAdded={fetchTasks} />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center">
            <ClipboardList className="w-6 h-6 mr-2 text-indigo-500" />
            Current Chores ({tasks.filter(t => !t.isCompleted).length} pending)
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
              <p className="text-xl">No tasks yet! Use the form above to add your first chore.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
              <TaskItem 
              key={task._id} 
              task={task} 
              onToggleComplete={toggleTaskComplete}
              onDelete={deleteTask}
            />
              ))}
            </div>
          )}

          {/* Placeholder for future features */}
          <div className="mt-10 pt-6 border-t">
            <p className="text-center text-gray-500 text-sm">
              Mark complete functionality and the Bill Splitting Calculator
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;