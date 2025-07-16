import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import { useData } from '../contexts/DataContext';

interface AIInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ isOpen, onClose }) => {
  const { insights, generateInsights, isProcessing, getPersonalizedRecommendations } = useAI();
  const { moodEntries, journalEntries } = useData();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations'>('insights');

  useEffect(() => {
    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen]);

  const loadRecommendations = async () => {
    try {
      const recs = await getPersonalizedRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleRefreshInsights = async () => {
    try {
      const userData = {
        moodEntries,
        journalEntries,
        lastWeek: moodEntries.slice(-7)
      };
      await generateInsights(userData);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'mood_trend': return TrendingUp;
      case 'stress_alert': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'positive_progress': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'mood_trend': return 'from-blue-500 to-cyan-500';
      case 'stress_alert': return 'from-red-500 to-orange-500';
      case 'recommendation': return 'from-purple-500 to-pink-500';
      case 'positive_progress': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold">AI Insights</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'insights'
                      ? 'bg-white/20 text-white'
                      : 'text-purple-100 hover:text-white'
                  }`}
                >
                  Insights
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'recommendations'
                      ? 'bg-white/20 text-white'
                      : 'text-purple-100 hover:text-white'
                  }`}
                >
                  Recommendations
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'insights' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Recent Insights</h3>
                    <button
                      onClick={handleRefreshInsights}
                      disabled={isProcessing}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {insights.length === 0 ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No insights available yet.</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Keep using the app to generate AI insights!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {insights.map((insight) => {
                        const Icon = getInsightIcon(insight.type);
                        const colorClass = getInsightColor(insight.type);
                        
                        return (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">
                                  {insight.title}
                                </h4>
                                <p className="text-gray-600 text-sm mb-2">
                                  {insight.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    Confidence: {Math.round(insight.confidence * 100)}%
                                  </span>
                                  {insight.actionable && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                      Actionable
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Personalized Recommendations</h3>
                  </div>

                  {recommendations.length === 0 ? (
                    <div className="text-center py-8">
                      <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Loading recommendations...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recommendations.map((recommendation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {recommendation}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={loadRecommendations}
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Get New Recommendations
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIInsightsPanel;