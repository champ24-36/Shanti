import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Heart, 
  Moon, 
  Dumbbell, 
  Zap,
  Plus,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import InstallPrompt from '../components/InstallPrompt';

const Dashboard: React.FC = () => {
  const { moodEntries, getWeeklyMoodData, addMoodEntry } = useData();
  const [showMoodEntry, setShowMoodEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: 3,
    sleep: 7,
    activity: 3,
    stress: 3,
    notes: ''
  });

  const weeklyData = getWeeklyMoodData();
  const todayEntry = moodEntries.find(entry => entry.date === format(new Date(), 'yyyy-MM-dd'));

  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addMoodEntry({
      ...newEntry,
      date: format(new Date(), 'yyyy-MM-dd')
    });
    setShowMoodEntry(false);
    setNewEntry({
      mood: 3,
      sleep: 7,
      activity: 3,
      stress: 3,
      notes: ''
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      <InstallPrompt />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Wellness Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Track your mental health journey with AI-powered insights</p>
        </div>
        <button
          onClick={() => setShowMoodEntry(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Today's Mood
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Heart}
          title="Current Mood"
          value={todayEntry ? `${todayEntry.mood}/5` : 'Not logged'}
          subtitle="Today's emotional state"
          color="bg-gradient-to-br from-pink-500 to-red-500"
        />
        <StatCard
          icon={Moon}
          title="Sleep Quality"
          value={todayEntry ? `${todayEntry.sleep}h` : 'Not logged'}
          subtitle="Hours of sleep last night"
          color="bg-gradient-to-br from-indigo-500 to-purple-500"
        />
        <StatCard
          icon={Dumbbell}
          title="Activity Level"
          value={todayEntry ? `${todayEntry.activity}/5` : 'Not logged'}
          subtitle="Physical activity today"
          color="bg-gradient-to-br from-green-500 to-teal-500"
        />
        <StatCard
          icon={Zap}
          title="Stress Level"
          value={todayEntry ? `${todayEntry.stress}/5` : 'Not logged'}
          subtitle="Current stress feeling"
          color="bg-gradient-to-br from-orange-500 to-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Mood Trend */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
          <h3 className="text-xl font-semibold mb-6">Weekly Mood Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis domain={[0, 5]} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
          <h3 className="text-xl font-semibold mb-6">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis domain={[0, 8]} stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="sleep" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="activity" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">AI Insights & Recommendations</h3>
            <div className="space-y-3">
              <p className="text-purple-100">
                📈 Your mood has improved by 20% this week compared to last week. Great progress!
              </p>
              <p className="text-purple-100">
                😴 Your sleep pattern shows consistency. Try to maintain 7-8 hours for optimal mental health.
              </p>
              <p className="text-purple-100">
                🧘 Consider adding 10 minutes of meditation to your routine based on your stress levels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Entry Modal */}
      {showMoodEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Log Today's Mood</h3>
            
            <form onSubmit={handleSubmitEntry} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Mood (1-5): {newEntry.mood}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>😢 Poor</span>
                  <span>😐 Fair</span>
                  <span>🙂 Good</span>
                  <span>😊 Very Good</span>
                  <span>😄 Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Sleep Hours: {newEntry.sleep}h
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={newEntry.sleep}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, sleep: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Activity Level (1-5): {newEntry.activity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newEntry.activity}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, activity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Stress Level (1-5): {newEntry.stress}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newEntry.stress}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                  rows={3}
                  placeholder="How are you feeling today?"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowMoodEntry(false)}
                  className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;