import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface AIAgent {
  id: string;
  name: string;
  type: 'content_moderation' | 'crisis_detection' | 'sentiment_analysis' | 'privacy_monitor' | 'cyberbullying_detection';
  status: 'active' | 'inactive' | 'error';
  lastActivity: Date;
  actionsToday: number;
  accuracy: number;
}

interface AIInsight {
  id: string;
  type: 'mood_trend' | 'sleep_pattern' | 'stress_alert' | 'positive_progress' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
  data?: any;
}

interface CrisisAlert {
  id: string;
  userId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  timestamp: Date;
  resolved: boolean;
  escalated: boolean;
}

interface AIContextType {
  agents: AIAgent[];
  insights: AIInsight[];
  crisisAlerts: CrisisAlert[];
  isProcessing: boolean;
  analyzeText: (text: string, type: 'journal' | 'community' | 'chat') => Promise<any>;
  generateInsights: (userData: any) => Promise<AIInsight[]>;
  detectCrisis: (content: string) => Promise<CrisisAlert | null>;
  moderateContent: (content: string) => Promise<{ approved: boolean; reason?: string }>;
  getPersonalizedRecommendations: () => Promise<string[]>;
  updateAgentStatus: (agentId: string, status: AIAgent['status']) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

export function AIProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize AI agents
    const initialAgents: AIAgent[] = [
      {
        id: 'content_mod',
        name: 'Content Moderation AI',
        type: 'content_moderation',
        status: 'active',
        lastActivity: new Date(),
        actionsToday: 156,
        accuracy: 98.7
      },
      {
        id: 'crisis_detect',
        name: 'Crisis Detection AI',
        type: 'crisis_detection',
        status: 'active',
        lastActivity: new Date(),
        actionsToday: 23,
        accuracy: 99.2
      },
      {
        id: 'sentiment_analysis',
        name: 'Sentiment Analysis AI',
        type: 'sentiment_analysis',
        status: 'active',
        lastActivity: new Date(),
        actionsToday: 342,
        accuracy: 96.8
      },
      {
        id: 'privacy_monitor',
        name: 'Privacy Monitor AI',
        type: 'privacy_monitor',
        status: 'active',
        lastActivity: new Date(),
        actionsToday: 89,
        accuracy: 97.5
      },
      {
        id: 'cyberbullying_detect',
        name: 'Cyberbullying Detection AI',
        type: 'cyberbullying_detection',
        status: 'active',
        lastActivity: new Date(),
        actionsToday: 67,
        accuracy: 95.3
      }
    ];

    setAgents(initialAgents);

    // Generate initial insights
    generateInitialInsights();
  }, [user]);

  const generateInitialInsights = async () => {
    const initialInsights: AIInsight[] = [
      {
        id: '1',
        type: 'mood_trend',
        title: 'Positive Mood Trend Detected',
        description: 'Your mood has improved by 15% over the past week. Keep up the great work!',
        confidence: 0.87,
        actionable: false,
        timestamp: new Date(),
        data: { improvement: 15, timeframe: '7 days' }
      },
      {
        id: '2',
        type: 'sleep_pattern',
        title: 'Sleep Schedule Optimization',
        description: 'Consider going to bed 30 minutes earlier to improve your sleep quality.',
        confidence: 0.92,
        actionable: true,
        timestamp: new Date(),
        data: { recommendation: 'earlier_bedtime', minutes: 30 }
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Mindfulness Practice Suggestion',
        description: 'Based on your stress patterns, try the 5-minute breathing exercise during lunch.',
        confidence: 0.78,
        actionable: true,
        timestamp: new Date(),
        data: { exercise: 'breathing', duration: 5, timing: 'lunch' }
      }
    ];

    setInsights(initialInsights);
  };

  const analyzeText = async (text: string, type: 'journal' | 'community' | 'chat') => {
    setIsProcessing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sentiment = analyzeSentiment(text);
      const emotions = extractEmotions(text);
      const themes = extractThemes(text);
      const riskLevel = assessRiskLevel(text);
      
      const analysis = {
        sentiment,
        emotions,
        themes,
        riskLevel,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        recommendations: generateRecommendations(sentiment, emotions, riskLevel),
        timestamp: new Date()
      };

      // Check for crisis indicators
      const crisisAlert = await detectCrisis(text);
      if (crisisAlert) {
        setCrisisAlerts(prev => [crisisAlert, ...prev]);
        toast.error('Crisis indicators detected. Support resources have been provided.');
      }

      return analysis;
    } catch (error) {
      toast.error('AI analysis failed. Please try again.');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateInsights = async (userData: any) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newInsights: AIInsight[] = [
        {
          id: Date.now().toString(),
          type: 'mood_trend',
          title: 'Weekly Progress Update',
          description: 'Your consistency in mood tracking is excellent. This helps us provide better insights.',
          confidence: 0.95,
          actionable: false,
          timestamp: new Date()
        }
      ];

      setInsights(prev => [...newInsights, ...prev].slice(0, 10));
      return newInsights;
    } finally {
      setIsProcessing(false);
    }
  };

  const detectCrisis = async (content: string): Promise<CrisisAlert | null> => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'hurt myself', 'die', 'death',
      'hopeless', 'no point', 'give up', 'cant go on', 'self harm', 'overdose'
    ];

    const lowerContent = content.toLowerCase();
    const foundKeywords = crisisKeywords.filter(keyword => lowerContent.includes(keyword));

    if (foundKeywords.length > 0) {
      const severity = foundKeywords.length >= 3 ? 'critical' : 
                     foundKeywords.length >= 2 ? 'high' : 'medium';

      const alert: CrisisAlert = {
        id: Date.now().toString(),
        userId: user?.id || 'anonymous',
        severity,
        content: content.substring(0, 200) + '...',
        timestamp: new Date(),
        resolved: false,
        escalated: severity === 'critical'
      };

      return alert;
    }

    return null;
  };

  const moderateContent = async (content: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const inappropriateWords = ['spam', 'scam', 'hate', 'violence'];
      const lowerContent = content.toLowerCase();
      
      const hasInappropriate = inappropriateWords.some(word => lowerContent.includes(word));
      
      updateAgentActivity('content_mod');
      
      return {
        approved: !hasInappropriate,
        reason: hasInappropriate ? 'Content contains inappropriate language' : undefined
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const getPersonalizedRecommendations = async (): Promise<string[]> => {
    const recommendations = [
      'Try a 10-minute morning meditation to start your day positively',
      'Consider journaling about three things you\'re grateful for',
      'Take a short walk outside to boost your mood naturally',
      'Practice deep breathing exercises when feeling stressed',
      'Connect with a friend or family member today',
      'Listen to calming music or nature sounds',
      'Set a consistent sleep schedule for better mental health'
    ];

    return recommendations.slice(0, 3);
  };

  const updateAgentStatus = (agentId: string, status: AIAgent['status']) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status, lastActivity: new Date() }
        : agent
    ));
  };

  const updateAgentActivity = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            lastActivity: new Date(),
            actionsToday: agent.actionsToday + 1
          }
        : agent
    ));
  };

  // Helper functions
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

  const extractThemes = (text: string): string[] => {
    const themes = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('career')) {
      themes.push('work');
    }
    if (lowerText.includes('family') || lowerText.includes('parent') || lowerText.includes('sibling')) {
      themes.push('family');
    }
    if (lowerText.includes('relationship') || lowerText.includes('partner') || lowerText.includes('friend')) {
      themes.push('relationships');
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('doctor')) {
      themes.push('health');
    }
    if (lowerText.includes('school') || lowerText.includes('study') || lowerText.includes('exam')) {
      themes.push('education');
    }
    
    return themes;
  };

  const assessRiskLevel = (text: string): 'low' | 'medium' | 'high' => {
    const highRiskWords = ['suicide', 'kill myself', 'end it all', 'no point living'];
    const mediumRiskWords = ['hopeless', 'worthless', 'burden', 'give up'];
    
    const lowerText = text.toLowerCase();
    
    if (highRiskWords.some(word => lowerText.includes(word))) return 'high';
    if (mediumRiskWords.some(word => lowerText.includes(word))) return 'medium';
    return 'low';
  };

  const generateRecommendations = (sentiment: string, emotions: string[], riskLevel: string): string[] => {
    const recommendations = [];
    
    if (sentiment === 'negative' || riskLevel === 'high') {
      recommendations.push('Consider reaching out to a mental health professional');
      recommendations.push('Practice grounding techniques like deep breathing');
    }
    
    if (emotions.includes('anxious')) {
      recommendations.push('Try the 4-7-8 breathing technique');
      recommendations.push('Consider progressive muscle relaxation');
    }
    
    if (emotions.includes('sad')) {
      recommendations.push('Engage in activities that usually bring you joy');
      recommendations.push('Connect with supportive friends or family');
    }
    
    if (sentiment === 'positive') {
      recommendations.push('Keep up the positive momentum');
      recommendations.push('Consider sharing your success with others');
    }
    
    return recommendations.slice(0, 3);
  };

  return (
    <AIContext.Provider value={{
      agents,
      insights,
      crisisAlerts,
      isProcessing,
      analyzeText,
      generateInsights,
      detectCrisis,
      moderateContent,
      getPersonalizedRecommendations,
      updateAgentStatus
    }}>
      {children}
    </AIContext.Provider>
  );
}