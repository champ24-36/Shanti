import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  type: 'mood_reminder' | 'journal_prompt' | 'crisis_alert' | 'community_update' | 'achievement' | 'recommendation';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationSettings {
  dailyReminders: boolean;
  moodTracking: boolean;
  journalPrompts: boolean;
  communityUpdates: boolean;
  crisisAlerts: boolean;
  parentalNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  scheduleReminder: (type: string, time: string) => void;
  sendCrisisAlert: (content: string, severity: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminders: true,
    moodTracking: true,
    journalPrompts: true,
    communityUpdates: false,
    crisisAlerts: true,
    parentalNotifications: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user) {
      // Initialize with welcome notification
      addNotification({
        type: 'achievement',
        title: 'Welcome to MindCare!',
        message: 'Your mental health journey starts here. Take a moment to explore the features.',
        priority: 'medium'
      });

      // Set up daily reminders
      if (settings.dailyReminders) {
        setupDailyReminders();
      }
    }
  }, [user]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50

    // Show browser notification for high priority items
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      showBrowserNotification(notification.title, notification.message);
    }

    // Show toast for urgent notifications
    if (notification.priority === 'urgent') {
      toast.error(notification.message, { duration: 8000 });
    } else if (notification.priority === 'high') {
      toast(notification.message, { duration: 5000 });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const scheduleReminder = (type: string, time: string) => {
    // In a real app, this would schedule actual notifications
    console.log(`Scheduled ${type} reminder for ${time}`);
  };

  const sendCrisisAlert = (content: string, severity: string) => {
    addNotification({
      type: 'crisis_alert',
      title: 'Crisis Support Available',
      message: 'We detected you might need support. Crisis resources are available 24/7.',
      priority: 'urgent',
      actionUrl: '/chat'
    });

    // In a real app, this would also notify emergency contacts if enabled
    if (settings.parentalNotifications) {
      console.log('Emergency contact notified');
    }
  };

  const setupDailyReminders = () => {
    // Simulate daily reminders
    const reminders = [
      {
        type: 'mood_reminder' as const,
        title: 'Daily Check-in',
        message: 'How are you feeling today? Take a moment to log your mood.',
        priority: 'medium' as const
      },
      {
        type: 'journal_prompt' as const,
        title: 'Journal Prompt',
        message: 'What are three things you\'re grateful for today?',
        priority: 'low' as const
      }
    ];

    // Add a random reminder every few seconds for demo
    setTimeout(() => {
      if (settings.moodTracking) {
        const reminder = reminders[Math.floor(Math.random() * reminders.length)];
        addNotification(reminder);
      }
    }, 10000);
  };

  const showBrowserNotification = (title: string, message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const isQuietHours = () => {
    if (!settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(settings.quietHours.start.replace(':', ''));
    const endTime = parseInt(settings.quietHours.end.replace(':', ''));
    
    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      settings,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      updateSettings,
      scheduleReminder,
      sendCrisisAlert
    }}>
      {children}
    </NotificationContext.Provider>
  );
}