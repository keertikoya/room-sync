import React, { useState, useEffect } from 'react';
import { 
  Home, ClipboardList, CheckCircle, Clock, Loader2, AlertTriangle, Calendar, Plus, User, Send, Check, X, Edit, DollarSign
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
const TaskItem = ({ task, onToggleComplete, onDelete, onEdit, editingTask, onSaveEdit, onCancelEdit, onEditChange }) => {
  const isEditing = editingTask && editingTask.id === task._id;
  const roommates = ['Alex', 'Beatrice', 'Carmen', 'Denise'];

  if (isEditing) {
    return (
      <div className="p-6 mb-3 rounded-xl shadow-lg bg-blue-50 border-l-4 border-blue-500">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Task Description</label>
            <input
              type="text"
              value={editingTask.description}
              onChange={(e) => onEditChange({ ...editingTask, description: e.target.value })}
              className="w-full rounded-lg border-2 border-blue-300 shadow-sm p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Task description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned To</label>
              <select
                value={editingTask.assignedTo}
                onChange={(e) => onEditChange({ ...editingTask, assignedTo: e.target.value })}
                className="w-full rounded-lg border-2 border-blue-300 shadow-sm p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {roommates.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={editingTask.dueDate}
                onChange={(e) => onEditChange({ ...editingTask, dueDate: e.target.value })}
                className="w-full rounded-lg border-2 border-blue-300 shadow-sm p-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          
          <div className="flex gap-4 justify-end pt-3">
          <button
              onClick={onSaveEdit}
              style={{
                padding: '12px 32px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '140px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              Save Changes
            </button>
            <button
              onClick={onCancelEdit}
              style={{
                padding: '12px 32px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                minWidth: '140px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
        
        <div className="flex items-center space-x-3 ml-4">
          {/* Due Date */}
          {task.dueDate && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
            </span>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            style={{ 
              padding: '8px', 
              borderRadius: '9999px', 
              backgroundColor: '#3b82f6',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            title="Edit task"
          >
            <Edit style={{ width: '20px', height: '20px', color: 'white' }} />
          </button>
          

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
};

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
        Chore Tracker
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

// BillSplitter Component
const BillSplitter = () => {
  const [billData, setBillData] = useState({
    description: '',
    totalAmount: '',
    paidBy: '',
    splitAmong: []
  });
  const [result, setResult] = useState(null);
  
  const roommates = ['Alex', 'Beatrice', 'Carmen', 'Denise'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBillData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (roommate) => {
    setBillData(prev => ({
      ...prev,
      splitAmong: prev.splitAmong.includes(roommate)
        ? prev.splitAmong.filter(r => r !== roommate)
        : [...prev.splitAmong, roommate]
    }));
  };

  const calculateSplit = (e) => {
    e.preventDefault();
    
    if (!billData.totalAmount || !billData.paidBy || billData.splitAmong.length === 0) {
      alert('Please fill in all fields and select at least one person to split among');
      return;
    }

    const total = parseFloat(billData.totalAmount);
    const perPerson = total / billData.splitAmong.length;
    
    const owes = billData.splitAmong
      .filter(person => person !== billData.paidBy)
      .map(person => ({
        name: person,
        amount: perPerson
      }));

    setResult({
      total,
      perPerson,
      paidBy: billData.paidBy,
      owes
    });
  };

  const resetForm = () => {
    setBillData({
      description: '',
      totalAmount: '',
      paidBy: '',
      splitAmong: []
    });
    setResult(null);
  };

  return (
    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl shadow-inner">
      <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Bill Splitting Calculator
      </h3>
      
      <form onSubmit={calculateSplit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bill Description
          </label>
          <input
            type="text"
            name="description"
            value={billData.description}
            onChange={handleChange}
            placeholder="e.g., Groceries, Utilities, etc."
            required
            className="w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount ($)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={billData.totalAmount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid By
            </label>
            <select
              name="paidBy"
              value={billData.paidBy}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Select person</option>
              {roommates.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split Among (select all who should pay)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {roommates.map(roommate => (
              <label key={roommate} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={billData.splitAmong.includes(roommate)}
                  onChange={() => handleCheckboxChange(roommate)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">{roommate}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md"
          >
            Calculate Split
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md"
          >
            Reset
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg border-2 border-green-300">
          <h4 className="text-lg font-bold text-gray-800 mb-3">Split Breakdown</h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Total Bill:</span> ${result.total.toFixed(2)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Per Person:</span> ${result.perPerson.toFixed(2)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Paid by:</span> {result.paidBy}
            </p>
            
            {result.owes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">Who Owes {result.paidBy}:</p>
                {result.owes.map(person => (
                  <p key={person.name} className="text-green-700 font-medium">
                    → {person.name} owes ${person.amount.toFixed(2)}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// App Component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

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

// Function to start editing a task
const startEditTask = (task) => {
  setEditingTask({
    id: task._id,
    description: task.description,
    assignedTo: task.assignedTo,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });
};

// Function to save edited task
const saveEditTask = async () => {
  if (!editingTask.description || !editingTask.assignedTo) {
    alert('Description and Roommate are required.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${editingTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: editingTask.description,
        assignedTo: editingTask.assignedTo,
        dueDate: editingTask.dueDate || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear editing state and refresh
    setEditingTask(null);
    fetchTasks();
  } catch (err) {
    console.error("Error updating task:", err);
    alert('Failed to update task');
  }
};

// Function to cancel editing
const cancelEdit = () => {
  setEditingTask(null);
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
              onEdit={startEditTask}
              editingTask={editingTask}
              onSaveEdit={saveEditTask}
              onCancelEdit={cancelEdit}
              onEditChange={setEditingTask}
            />
              ))}
            </div>
          )}

          {/* Bill Splitting Calculator */}
          <div className="mt-10">
            <BillSplitter />
          </div>

          {/* Placeholder for future features */}
          <div className="mt-10 pt-6 border-t">
            <p className="text-center text-gray-500 text-sm">
              More features coming soon
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;