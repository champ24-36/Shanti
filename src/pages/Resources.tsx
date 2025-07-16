import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Headphones, 
  Book, 
  Video, 
  Heart, 
  Brain,
  Leaf,
  Clock,
  Star,
  Search,
  Filter,
  Download,
  Volume2,
  SkipBack,
  SkipForward,
  Sparkles,
  Wand2
} from 'lucide-react';
import { aiContentService, AIGeneratedContent } from '../services/aiContentService';
import AmbientSounds from '../components/AmbientSounds';
import CrisisContacts from '../components/CrisisContacts';
import toast from 'react-hot-toast';

interface Resource extends AIGeneratedContent {
  rating: number;
  videoUrl?: string;
}

const Resources: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'resources' | 'ambient' | 'crisis'>('resources');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load initial AI-generated content
    loadInitialResources();
  }, []);

  const loadInitialResources = () => {
    const aiContent = aiContentService.getContentLibrary();
    const resourcesWithRatings: Resource[] = aiContent.map(content => ({
      ...content,
      rating: 4.5 + Math.random() * 0.5 // Random rating between 4.5-5.0
    }));
    setResources(resourcesWithRatings);
  };

  const generateNewContent = async () => {
    setIsGenerating(true);
    try {
      const topics = [
        { topic: 'anxiety-breathing', category: 'breathing' as const, duration: 5 },
        { topic: 'depression-support', category: 'education' as const, duration: 12 },
        { topic: 'mindfulness-meditation', category: 'meditation' as const, duration: 10 },
        { topic: 'sleep-preparation', category: 'meditation' as const, duration: 15 }
      ];
      
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const newContent = await aiContentService.generateContent(
        randomTopic.topic,
        randomTopic.duration,
        randomTopic.category
      );
      
      const newResource: Resource = {
        ...newContent,
        rating: 4.5 + Math.random() * 0.5
      };
      
      setResources(prev => [newResource, ...prev]);
      toast.success('New AI-generated content created!');
    } catch (error) {
      toast.error('Failed to generate new content');
    } finally {
      setIsGenerating(false);
    }
  };

  const resourceTypes = [
    { value: 'all', label: 'All Resources', icon: Heart },
    { value: 'meditation', label: 'Meditation', icon: Brain },
    { value: 'breathing', label: 'Breathing', icon: Leaf },
    { value: 'education', label: 'Education', icon: Book },
    { value: 'exercise', label: 'Exercises', icon: Heart }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesType = selectedType === 'all' || resource.category === selectedType;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.script.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      meditation: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      breathing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      education: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      exercise: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Beginner: 'text-green-600 dark:text-green-400',
      Intermediate: 'text-yellow-600 dark:text-yellow-400',
      Advanced: 'text-red-600 dark:text-red-400'
    };
    return colors[difficulty] || 'text-gray-600 dark:text-gray-400';
  };

  const handlePlayAudio = (resource: Resource) => {
    if (playingAudio === resource.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(resource.audioUrl);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setPlayingAudio(null);
        setCurrentTime(0);
      });
      
      audio.volume = volume;
      audio.play().then(() => {
        setPlayingAudio(resource.id);
      }).catch(() => {
        toast.error('Unable to play audio. This is a demo with placeholder audio.');
        // For demo purposes, simulate playback
        setPlayingAudio(resource.id);
        setTimeout(() => setPlayingAudio(null), 5000);
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'resources', label: 'AI Resources', icon: Sparkles },
    { id: 'ambient', label: 'Ambient Sounds', icon: Volume2 },
    { id: 'crisis', label: 'Crisis Support', icon: Heart }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Mental Health Resources</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          AI-powered guided meditations, breathing exercises, educational content, and crisis support
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'btn-primary'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'resources' && (
            <div className="space-y-8">
              {/* AI Content Generation */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-3 flex items-center space-x-2">
                      <Wand2 className="w-8 h-8" />
                      <span>AI-Powered Content</span>
                    </h2>
                    <p className="text-purple-100 mb-4">
                      Our AI creates personalized mental health content using advanced language models 
                      and natural voice synthesis for authentic, empathetic support.
                    </p>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        onClick={generateNewContent}
                        disabled={isGenerating}
                        className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isGenerating ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5" />
                            <span>Generate New Content</span>
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <Brain className="w-16 h-16" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Resource Type Tabs */}
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedType === type.value
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'btn-primary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Resources Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Headphones className="w-5 h-5 text-purple-600" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.category)}`}>
                          {resource.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{resource.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                      {resource.script.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{resource.duration}</span>
                        </div>
                        <span className={`font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Audio Player */}
                    {playingAudio === resource.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Now Playing</span>
                          <span className="text-sm text-gray-500">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800 rounded">
                              <SkipBack className="w-4 h-4" />
                            </button>
                            <button className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800 rounded">
                              <SkipForward className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={(e) => {
                                const newVolume = parseFloat(e.target.value);
                                setVolume(newVolume);
                                if (audioRef.current) {
                                  audioRef.current.volume = newVolume;
                                }
                              }}
                              className="w-16"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <button
                      onClick={() => handlePlayAudio(resource)}
                      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      {playingAudio === resource.id ? (
                        <>
                          <Pause className="w-5 h-5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <Headphones className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No resources found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    Try adjusting your search or generate new AI content.
                  </p>
                  <button
                    onClick={generateNewContent}
                    disabled={isGenerating}
                    className="btn-primary"
                  >
                    Generate New Content
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ambient' && <AmbientSounds />}
          {activeTab === 'crisis' && <CrisisContacts />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Resources;