import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  sleep: number;
  activity: number;
  stress: number;
  notes?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  title: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  ai_insights?: string;
  audio_url?: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  title: string;
  content: string;
  timestamp: Date;
  replies: number;
  likes: number;
  category: string;
  is_anonymous: boolean;
  created_at: string;
}

interface DataContextType {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  communityPosts: CommunityPost[];
  loading: boolean;
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'sentiment' | 'emotions' | 'ai_insights' | 'created_at'>) => Promise<void>;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'user_id' | 'timestamp' | 'replies' | 'likes' | 'created_at'>) => Promise<void>;
  getWeeklyMoodData: () => any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// AI analysis functions
const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'joy', 'excited', 'grateful', 'blessed'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'depressed', 'anxious', 'worried', 'stressed'];
  
  const words = text.toLowerCase().split(/\W+/);
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const extractEmotions = (text: string): string[] => {
  const emotionKeywords = {
    happy: ['happy', 'joy', 'excited', 'cheerful', 'elated'],
    sad: ['sad', 'down', 'blue', 'melancholy', 'depressed'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed'],
    angry: ['angry', 'mad', 'frustrated', 'irritated', 'furious'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciative'],
    hopeful: ['hopeful', 'optimistic', 'confident', 'positive'],
    lonely: ['lonely', 'isolated', 'alone', 'disconnected']
  };
  
  const words = text.toLowerCase().split(/\W+/);
  const emotions: string[] = [];
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => words.includes(keyword))) {
      emotions.push(emotion);
    }
  });
  
  return emotions.length > 0 ? emotions : ['neutral'];
};

const generateAIInsights = (content: string, sentiment: string, emotions: string[]): string => {
  const insights = [
    `Your journal entry shows ${sentiment} sentiment. This reflects your current emotional state.`,
    `The emotions detected (${emotions.join(', ')}) suggest you're processing various feelings.`,
    `Consider practicing mindfulness exercises to maintain emotional balance.`,
    `Your self-reflection shows good emotional awareness - keep journaling regularly.`
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setMoodEntries([]);
      setJournalEntries([]);
      setCommunityPosts([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load mood entries
      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (moodError) throw moodError;
      setMoodEntries(moodData || []);

      // Load journal entries
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (journalError) throw journalError;
      setJournalEntries(journalData || []);

      // Load community posts
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      
      const formattedPosts = (postsData || []).map(post => ({
        ...post,
        timestamp: new Date(post.created_at)
      }));
      setCommunityPosts(formattedPosts);

    } catch (error: any) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert([{
          ...entry,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setMoodEntries(prev => [data, ...prev]);
      toast.success('Mood entry saved!');
    } catch (error: any) {
      console.error('Error adding mood entry:', error);
      toast.error('Failed to save mood entry');
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'user_id' | 'sentiment' | 'emotions' | 'ai_insights' | 'created_at'>) => {
    if (!user) return;

    try {
      const sentiment = analyzeSentiment(entry.content);
      const emotions = extractEmotions(entry.content);
      const ai_insights = generateAIInsights(entry.content, sentiment, emotions);

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          ...entry,
          user_id: user.id,
          sentiment,
          emotions,
          ai_insights
        }])
        .select()
        .single();

      if (error) throw error;

      setJournalEntries(prev => [data, ...prev]);
      toast.success('Journal entry saved!');
    } catch (error: any) {
      console.error('Error adding journal entry:', error);
      toast.error('Failed to save journal entry');
    }
  };

  const addCommunityPost = async (post: Omit<CommunityPost, 'id' | 'user_id' | 'timestamp' | 'replies' | 'likes' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...post,
          user_id: user.id,
          author_name: post.is_anonymous ? 'Anonymous User' : user.name,
          likes: 0,
          replies: 0
        }])
        .select()
        .single();

      if (error) throw error;

      const formattedPost = {
        ...data,
        timestamp: new Date(data.created_at)
      };

      setCommunityPosts(prev => [formattedPost, ...prev]);
      toast.success('Post created successfully!');
    } catch (error: any) {
      console.error('Error adding community post:', error);
      toast.error('Failed to create post');
    }
  };

  const getWeeklyMoodData = () => {
    // Implementation for weekly mood data chart
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      const entry = moodEntries.find(e => e.date === dateString);
      weekData.push({
        date: format(date, 'EEE'),
        mood: entry?.mood || 0,
        sleep: entry?.sleep || 0,
        activity: entry?.activity || 0,
        stress: entry?.stress || 0
      });
    }
    
    return weekData;
  };

  return (
    <DataContext.Provider value={{
      moodEntries,
      journalEntries,
      communityPosts,
      loading,
      addMoodEntry,
      addJournalEntry,
      addCommunityPost,
      getWeeklyMoodData
    }}>
      {children}
    </DataContext.Provider>
  );
}