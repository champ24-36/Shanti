import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Shield, 
  BarChart3,
  Activity,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Brain
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for admin dashboard
  const userStats = {
    totalUsers: 12847,
    activeUsers: 8934,
    newUsers: 234,
    crisisInterventions: 12
  };
 
  const weeklyData = [
    { day: 'Mon', users: 1200, posts: 45, crises: 2 },
    { day: 'Tue', users: 1350, posts: 52, crises: 1 },
    { day: 'Wed', users: 1180, posts: 38, crises: 3 },
    { day: 'Thu', users: 1420, posts: 61, crises: 0 },
    { day: 'Fri', users: 1380, posts: 48, crises: 2 },
    { day: 'Sat', users: 1150, posts: 35, crises: 1 },
    { day: 'Sun', users: 1050, posts: 29, crises: 1 }
  ];

  const communityData = [
    { name: 'General Discussion', value: 35, color: '#3b82f6' },
    { name: 'Anxiety Support', value: 25, color: '#8b5cf6' },
    { name: 'Depression Support', value: 20, color: '#06b6d4' },
    { name: 'Success Stories', value: 15, color: '#10b981' },
    { name: 'Crisis Support', value: 5, color: '#ef4444' }
  ];

  const flaggedContent = [
    {
      id: '1',
      type: 'Post',
      content: 'Inappropriate language detected in community post',
      author: 'Anonymous User',
      timestamp: '2 hours ago',
      severity: 'Medium',
      status: 'Pending'
    },
    {
      id: '2',
      type: 'Comment',
      content: 'Potential cyberbullying detected',
      author: 'User123',
      timestamp: '4 hours ago',
      severity: 'High',
      status: 'Under Review'
    },
    {
      id: '3',
      type: 'Post',
      content: 'Crisis keywords detected - user may need immediate help',
      author: 'Anonymous User',
      timestamp: '6 hours ago',
      severity: 'Critical',
      status: 'Escalated'
    }
  ];

  const aiAgentStatus = [
    { name: 'Content Moderation AI', status: 'Active', uptime: '99.8%', lastCheck: '2 min ago' },
    { name: 'Crisis Detection AI', status: 'Active', uptime: '99.9%', lastCheck: '1 min ago' },
    { name: 'Sentiment Analysis AI', status: 'Active', uptime: '99.7%', lastCheck: '3 min ago' },
    { name: 'Cyberbullying Detection', status: 'Active', uptime: '99.5%', lastCheck: '1 min ago' },
    { name: 'Privacy Monitor AI', status: 'Warning', uptime: '98.2%', lastCheck: '15 min ago' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Moderation', icon: Shield },
    { id: 'ai-agents', label: 'AI Agents', icon: Brain },
    { id: 'reports', label: 'Reports & Analytics', icon: Activity }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600';
      case 'Warning': return 'text-yellow-600';
      case 'Error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor platform health, user safety, and AI agent performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{userStats.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Users (24h)</p>
              <p className="text-3xl font-bold">{userStats.activeUsers.toLocaleString()}</p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">New Users (7d)</p>
              <p className="text-3xl font-bold">{userStats.newUsers}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Crisis Interventions</p>
              <p className="text-3xl font-bold">{userStats.crisisInterventions}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-purple-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} />
                    <Line type="monotone" dataKey="posts" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Community Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={communityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {communityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Agent Status */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Agent Status</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiAgentStatus.map((agent, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <span className={`font-semibold ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Uptime: {agent.uptime}</p>
                      <p>Last Check: {agent.lastCheck}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Content Moderation Tab */}
        {activeTab === 'content' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Flagged Content</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Flag className="w-4 h-4" />
                <span>{flaggedContent.length} items pending review</span>
              </div>
            </div>

            <div className="space-y-4">
              {flaggedContent.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {item.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{item.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>Author: {item.author}</span>
                      <span className="ml-4">Status: {item.status}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        <XCircle className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Agents Tab */}
        {activeTab === 'ai-agents' && (
          <div className="space-y-6">
            {aiAgentStatus.map((agent, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    agent.status === 'Active' ? 'bg-green-100 text-green-700' :
                    agent.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{agent.uptime}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Last Health Check</p>
                    <p className="text-lg font-semibold text-gray-900">{agent.lastCheck}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Actions Today</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.floor(Math.random() * 1000)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">User Management</h3>
            <p className="text-gray-600">User management features would be implemented here, including user search, account status management, and user activity monitoring.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Reports & Analytics</h3>
            <p className="text-gray-600">Detailed analytics and reporting features would be implemented here, including user engagement metrics, platform health reports, and AI performance analytics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;