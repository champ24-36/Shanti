import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  sleep: number; // hours
  activity: number; // 1-5 scale
  stress: number; // 1-5 scale
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  emotions: string[];
  aiInsights?: string;
  audioUrl?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  title: string;
  content: string;
  timestamp: Date;
  replies: number;
  likes: number;
  category: string;
  isAnonymous: boolean;
}

interface DataContextType {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  communityPosts: CommunityPost[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'sentiment' | 'emotions' | 'aiInsights'>) => void;
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'replies' | 'likes'>) => void;
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

// Mock AI analysis functions
const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'joy', 'excited'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'depressed', 'anxious'];
  
  const words = text.toLowerCase().split(' ');
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

const extractEmotions = (text: string): string[] => {
  const emotionKeywords = {
    happy: ['happy', 'joy', 'excited', 'cheerful'],
    sad: ['sad', 'down', 'blue', 'melancholy'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed'],
    angry: ['angry', 'mad', 'frustrated', 'irritated'],
    grateful: ['grateful', 'thankful', 'blessed', 'appreciative']
  };
  
  const words = text.toLowerCase().split(' ');
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
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockMoodEntries: MoodEntry[] = [
      {
        id: '1',
        date: format(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        mood: 4,
        sleep: 7,
        activity: 3,
        stress: 2,
        notes: 'Feeling good today'
      },
      {
        id: '2',
        date: format(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        mood: 3,
        sleep: 6,
        activity: 4,
        stress: 3,
        notes: 'Average day'
      },
      {
        id: '3',
        date: format(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        mood: 5,
        sleep: 8,
        activity: 5,
        stress: 1,
        notes: 'Excellent day!'
      }
    ];

    const mockJournalEntries: JournalEntry[] = [
      {
        id: '1',
        date: format(new Date(), 'yyyy-MM-dd'),
        title: 'Reflecting on Today',
        content: 'Today was a good day. I felt happy and accomplished several tasks. Looking forward to tomorrow.',
        sentiment: 'positive',
        emotions: ['happy', 'grateful'],
        aiInsights: 'Your positive outlook is encouraging. Continue focusing on daily accomplishments.'
      }
    ];

    const mockCommunityPosts: CommunityPost[] = [
      {
        id: '1',
        author: 'Anonymous User',
        title: 'Coping with workplace stress',
        content: 'Looking for advice on managing stress at work. Any tips would be appreciated.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        replies: 12,
        likes: 8,
        category: 'Stress Management',
        isAnonymous: true
      },
      {
        id: '2',
        author: 'Sarah M.',
        title: 'Meditation changed my life',
        content: 'Sharing my 6-month meditation journey and how it helped with anxiety.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        replies: 25,
        likes: 34,
        category: 'Success Stories',
        isAnonymous: false
      }
    ];

    setMoodEntries(mockMoodEntries);
    setJournalEntries(mockJournalEntries);
    setCommunityPosts(mockCommunityPosts);
  }, []);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setMoodEntries(prev => [...prev, newEntry]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'sentiment' | 'emotions' | 'aiInsights'>) => {
    const sentiment = analyzeSentiment(entry.content);
    const emotions = extractEmotions(entry.content);
    const aiInsights = generateAIInsights(entry.content, sentiment, emotions);
    
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      sentiment,
      emotions,
      aiInsights
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'timestamp' | 'replies' | 'likes'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: Date.now().toString(),
      timestamp: new Date(),
      replies: 0,
      likes: 0
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const getWeeklyMoodData = () => {
    const today = new Date();
    const start = startOfWeek(today);
    const end = endOfWeek(today);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateString = format(day, 'yyyy-MM-dd');
      const entry = moodEntries.find(e => e.date === dateString);
      return {
        date: format(day, 'EEE'),
        mood: entry?.mood || 0,
        sleep: entry?.sleep || 0,
        activity: entry?.activity || 0,
        stress: entry?.stress || 0
      };
    });
  };

  return (
    <DataContext.Provider value={{
      moodEntries,
      journalEntries,
      communityPosts,
      addMoodEntry,
      addJournalEntry,
      addCommunityPost,
      getWeeklyMoodData
    }}>
      {children}
    </DataContext.Provider>
  );
}