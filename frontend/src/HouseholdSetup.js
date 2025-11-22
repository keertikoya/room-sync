import React, { useState } from 'react';
import { Home, Plus, LogIn as LoginIcon, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const HouseholdSetup = () => {
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [householdName, setHouseholdName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);

  const { user, token, updateUser } = useAuth();

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/create-household', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: householdName,
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create household');
      }

      setCreatedCode(data.household.roomCode);
      updateUser({ ...user, householdId: data.household });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/join-household', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomCode: roomCode.toUpperCase(),
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join household');
      }

      updateUser({ ...user, householdId: data.household });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (createdCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Household Created!</h2>
          <p className="text-gray-600 mb-6">Share this code with your roommates</p>
          
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Room Code</p>
            <p className="text-4xl font-bold text-indigo-600 tracking-widest">{createdCode}</p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <Home className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">Let's set up your household</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setMode('create')}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all text-left group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-all">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Household</h3>
              <p className="text-gray-600">Start a new household and invite roommates</p>
            </button>

            <button
              onClick={() => setMode('join')}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all text-left group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-all">
                <LoginIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Join Household</h3>
              <p className="text-gray-600">Enter a room code to join existing household</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <button
          onClick={() => setMode(null)}
          className="text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === 'create' ? 'Create Household' : 'Join Household'}
        </h2>

        {mode === 'create' ? (
          <form onSubmit={handleCreateHousehold} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household Name
              </label>
              <input
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="e.g., Apt 4B, The Den, etc."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Household'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinHousehold} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength="6"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase text-center text-2xl tracking-widest font-bold"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Household'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HouseholdSetup;