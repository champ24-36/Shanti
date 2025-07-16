import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Heart, 
  Flag, 
  Search,
  Filter,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Send,
  X
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
}

const Community: React.FC = () => {
  const { communityPosts, addCommunityPost } = useData();
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [flaggedPosts, setFlaggedPosts] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [replies, setReplies] = useState<Record<string, Reply[]>>({});
  const [newReply, setNewReply] = useState<Record<string, string>>({});
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General Discussion',
    isAnonymous: true
  });

  const categories = [
    'All',
    'General Discussion',
    'Anxiety Support',
    'Depression Support',
    'Stress Management',
    'Success Stories',
    'Crisis Support',
    'Resources & Tips'
  ];

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    
    addCommunityPost({
      ...newPost,
      author: newPost.isAnonymous ? 'Anonymous User' : 'You'
    });
    
    setNewPost({
      title: '',
      content: '',
      category: 'General Discussion',
      isAnonymous: true
    });
    setShowNewPost(false);
    toast.success('Post created successfully!');
  };

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.success('Like removed');
      } else {
        newSet.add(postId);
        toast.success('Post liked!');
      }
      return newSet;
    });
  };

  const handleFlag = (postId: string) => {
    setFlaggedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.success('Flag removed');
      } else {
        newSet.add(postId);
        toast.success('Post flagged for review');
      }
      return newSet;
    });
  };

  const handleComment = (postId: string) => {
    setShowComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSubmitReply = (postId: string) => {
    const replyContent = newReply[postId];
    if (!replyContent?.trim()) return;

    const reply: Reply = {
      id: Date.now().toString(),
      author: 'You',
      content: replyContent,
      timestamp: new Date(),
      isAnonymous: false
    };

    setReplies(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), reply]
    }));

    setNewReply(prev => ({
      ...prev,
      [postId]: ''
    }));

    toast.success('Reply posted!');
  };

  const filteredPosts = communityPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'General Discussion': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Anxiety Support': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'Depression Support': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Stress Management': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'Success Stories': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'Crisis Support': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'Resources & Tips': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Support</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Connect with others in a safe, supportive environment</p>
        </div>
        
        <button
          onClick={() => setShowNewPost(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Post
        </button>
      </div>

      {/* Community Guidelines */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Community Guidelines</p>
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <p>• Be respectful and supportive of all community members</p>
              <p>• Share experiences, not medical advice</p>
              <p>• Maintain anonymity to protect privacy</p>
              <p>• Report inappropriate content using the flag button</p>
              <p>• AI moderation is active to ensure a safe space</p>
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
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white dark:bg-gray-800"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Be the first to start a conversation in this category.</p>
            <button
              onClick={() => setShowNewPost(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Post
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 dark:border-purple-700 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    {post.isAnonymous ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {post.author.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{post.author}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(post.timestamp, 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
     
                  <button 
                    onClick={() => handleFlag(post.id)}
                    title="Flag the comment"
                    className={`btn-header p-2 ${
                      flaggedPosts.has(post.id)
                        ? 'text-red-600 dark:text-red-400'
                        : ''
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{post.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`btn-header flex items-center space-x-2 ${
                      likedPosts.has(post.id)
                        ? 'text-red-500 dark:text-red-400'
                        : ''
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </span>
                  </button>
                  <button 
                    onClick={() => handleComment(post.id)}
                    className="btn-header flex items-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {post.replies + (replies[post.id]?.length || 0)} replies
                    </span>
                  </button>
                </div>
                
                {post.category === 'Crisis Support' && (
                  <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Crisis Alert - Monitored</span>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              {showComments.has(post.id) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Replies</h4>
                  
                  {/* Existing Replies */}
                  <div className="space-y-4 mb-4">
                    {replies[post.id]?.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                            {reply.isAnonymous ? (
                              <User className="w-3 h-3 text-white" />
                            ) : (
                              <span className="text-white font-semibold text-xs">
                                {reply.author.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {reply.author}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(reply.timestamp, 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newReply[post.id] || ''}
                      onChange={(e) => setNewReply(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a supportive reply..."
                      className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSubmitReply(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleSubmitReply(post.id)}
                      disabled={!newReply[post.id]?.trim()}
                      className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h3>
              <button
                onClick={() => setShowNewPost(false)}
                className="btn-header p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitPost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                  placeholder="What would you like to discuss?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
                  rows={6}
                  placeholder="Share your thoughts, experiences, or questions..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
                  Post anonymously (recommended for privacy)
                </label>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      <strong>AI Moderation:</strong> Your post will be automatically screened for harmful content 
                      and compliance with community guidelines before being published.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Publish Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
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

export default Community;