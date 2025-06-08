import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  Plus, 
  Calendar,
  Smile,
  Frown,
  Meh,
  Brain,
  Clock,
  Search,
  Mic,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAI } from '../contexts/AIContext';
import { format } from 'date-fns';
import VoiceRecorder from '../components/VoiceRecorder';
import toast from 'react-hot-toast';

const Journal: React.FC = () => {
  const { journalEntries, addJournalEntry } = useData();
  const { analyzeText, isProcessing } = useAI();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    
    try {
      // Analyze the journal entry with AI
      const analysis = await analyzeText(newEntry.content, 'journal');
      
      addJournalEntry({
        ...newEntry,
        date: format(new Date(), 'yyyy-MM-dd'),
        sentiment: analysis.sentiment,
        emotions: analysis.emotions,
        aiInsights: analysis.recommendations.join(' ')
      });
      
      setNewEntry({ title: '', content: '' });
      setShowNewEntry(false);
      toast.success('Journal entry saved with AI insights!');
    } catch (error) {
      toast.error('Failed to analyze entry. Saving without AI insights.');
      addJournalEntry({
        ...newEntry,
        date: format(new Date(), 'yyyy-MM-dd')
      });
      setNewEntry({ title: '', content: '' });
      setShowNewEntry(false);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setNewEntry(prev => ({
      ...prev,
      content: prev.content + (prev.content ? ' ' : '') + text
    }));
    toast.success('Voice transcription added to your entry!');
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="w-5 h-5 text-green-500" />;
      case 'negative': return <Frown className="w-5 h-5 text-red-500" />;
      default: return <Meh className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'negative': return 'border-red-200 bg-red-50';
      default: return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: 'bg-yellow-100 text-yellow-700',
      sad: 'bg-blue-100 text-blue-700',
      anxious: 'bg-purple-100 text-purple-700',
      angry: 'bg-red-100 text-red-700',
      grateful: 'bg-green-100 text-green-700',
      hopeful: 'bg-cyan-100 text-cyan-700',
      lonely: 'bg-gray-100 text-gray-700'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Journal</h1>
          <p className="text-gray-600 mt-2">Express yourself and gain insights through AI analysis</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewEntry(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Entry
          </motion.button>
        </div>
      </motion.div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No journal entries yet</h3>
            <p className="text-gray-500 mb-6">Start your journaling journey and let AI help you understand your thoughts and emotions.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Write Your First Entry
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 ${getSentimentColor(entry.sentiment)} hover:shadow-xl transition-all duration-200 cursor-pointer`}
                onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                    {getSentimentIcon(entry.sentiment)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {entry.date}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                  {entry.content}
                </p>
                
                {/* Emotions */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {entry.emotions.map((emotion, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(emotion)}`}
                    >
                      {emotion}
                    </motion.span>
                  ))}
                </div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {selectedEntry === entry.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-4 mt-4"
                    >
                      {/* Full Content */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Full Entry</h4>
                        <p className="text-gray-700 leading-relaxed">{entry.content}</p>
                      </div>
                      
                      {/* AI Insights */}
                      {entry.aiInsights && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Brain className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                <Sparkles className="w-4 h-4 mr-1 text-purple-600" />
                                AI Insights
                              </h4>
                              <p className="text-gray-700 text-sm">{entry.aiInsights}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Audio Playback */}
                      {entry.audioUrl && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            <Mic className="w-4 h-4" />
                            <span className="text-sm font-medium">Play Audio</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">New Journal Entry</h3>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isRecording 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isRecording ? 'Voice Active' : 'Voice Input'}
                    </span>
                  </motion.button>
                </div>
              </div>
              
              <form onSubmit={handleSubmitEntry} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Title
                  </label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's on your mind today?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Thoughts
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={8}
                    placeholder="Express your thoughts, feelings, and experiences..."
                    required
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      AI will analyze your entry for sentiment, emotions, and provide personalized insights.
                    </p>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>{newEntry.content.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Voice Recorder */}
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <VoiceRecorder 
                      onTranscription={handleVoiceTranscription}
                      className="border border-gray-200 rounded-xl p-4"
                    />
                  </motion.div>
                )}

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Analyzing with AI...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Save & Analyze Entry
                      </div>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowNewEntry(false)}
                    className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;