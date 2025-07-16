import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Phone, 
  Heart,
  Brain,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'crisis' | 'normal';
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI mental health support companion. I'm here to listen, provide support, and help you with coping strategies. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'die', 'death',
    'hopeless', 'no point', 'give up', 'cant go on', 'self harm', 'unalive'
  ];

  // Crisis contact database by country
  const crisisDatabase: Record<string, any> = {
    US: {
      country: 'United States',
      emergency: '911',
      contacts: [
        { name: 'Suicide & Crisis Lifeline', number: '988', type: 'phone' },
        { name: 'Crisis Text Line', number: '741741', type: 'text' }
      ]
    },
    CA: {
      country: 'Canada',
      emergency: '911',
      contacts: [
        { name: 'Talk Suicide Canada', number: '1-833-456-4566', type: 'phone' },
        { name: 'Crisis Text Line Canada', number: '686868', type: 'text' }
      ]
    },
    GB: {
      country: 'United Kingdom',
      emergency: '999',
      contacts: [
        { name: 'Samaritans', number: '116 123', type: 'phone' },
        { name: 'Samaritans Text', number: '07725 909090', type: 'text' }
      ]
    },
    AU: {
      country: 'Australia',
      emergency: '000',
      contacts: [
        { name: 'Lifeline Australia', number: '13 11 14', type: 'phone' },
        { name: 'Lifeline Text', number: '0477 13 11 14', type: 'text' }
      ]
    },
    IN: {
      country: 'India',
      emergency: '112',
      contacts: [
        { name: 'AASRA', number: '91-9820466726', type: 'phone' },
        { name: 'SNEHA', number: '044-24640050', type: 'phone' }
      ]
    }
  };

  const detectCrisis = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (detectCrisis(userMessage)) {
      setCrisisDetected(true);
      const userCountry = user?.country || 'US';
      const countryData = crisisDatabase[userCountry];
      
      return `I'm very concerned about what you've shared. Your life has value and there are people who want to help. Please consider reaching out to a crisis hotline immediately. In ${countryData.country}, you can call ${countryData.emergency} for emergencies or ${countryData.contacts[0].number} for ${countryData.contacts[0].name}. Would you like me to help you find more local emergency resources?`;
    }

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. Anxiety can be overwhelming, but there are techniques that can help. Try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. Would you like me to guide you through some other grounding exercises?";
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I hear that you're feeling sad. It's important to acknowledge these feelings rather than push them away. Sometimes sadness is our mind's way of processing difficult experiences. Have you been able to engage in any activities that usually bring you joy recently?";
    }

    if (lowerMessage.includes('stressed') || lowerMessage.includes('stress')) {
      return "Stress can really take a toll on both our mental and physical health. Let's work on some stress management techniques. Have you tried progressive muscle relaxation or mindfulness meditation? I can guide you through either of these.";
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return "Sleep issues can significantly impact mental health. Good sleep hygiene is crucial. Try establishing a consistent bedtime routine, avoiding screens an hour before bed, and creating a calm environment. Are there specific thoughts keeping you awake at night?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('help')) {
      return "I'm glad I could help! Remember, seeking support is a sign of strength, not weakness. It's wonderful that you're taking steps to care for your mental health. Is there anything specific you'd like to work on or discuss further?";
    }

    // Default supportive responses
    const responses = [
      "Thank you for sharing that with me. It takes courage to open up about your feelings. Can you tell me more about what's been on your mind lately?",
      "I appreciate you trusting me with your thoughts. Your feelings are valid, and it's important to process them. What's been the most challenging part of your day?",
      "I'm here to listen and support you. Everyone faces difficult times, and you're not alone in this. What kind of support would be most helpful for you right now?",
      "It sounds like you're going through a lot. Remember that it's okay to not be okay sometimes. What are some things that have helped you cope in the past?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'normal'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: detectCrisis(inputMessage) ? 'crisis' : 'normal'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const userCountry = user?.country || 'US';
  const countryData = crisisDatabase[userCountry];

  return (
    <div className="h-full flex flex-col">
      {/* Header - 10% */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white" style={{ height: '10%' }}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-100">AI Mental Health Support</p>
            <p className="text-purple-100">24/7 confidential support and guidance</p>
          </div>
        </div>
      </div>

      {/* Crisis Alert */}
      {crisisDetected && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-6 mb-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">Crisis Support Resources - {countryData.country}</h3>
              <div className="space-y-2 text-red-700 dark:text-red-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold">Emergency: {countryData.emergency}</span>
                </div>
                {countryData.contacts.map((contact: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span className="font-semibold">{contact.name}: {contact.number}</span>
                  </div>
                ))}
                <p className="text-sm">If you're in immediate danger, please call {countryData.emergency} or go to your nearest emergency room.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages - 75% */}
      <div className="flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 overflow-y-auto border border-purple-200 dark:border-purple-700" style={{ height: '75%' }}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                  : 'bg-gradient-to-br from-purple-600 to-pink-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                    : message.type === 'crisis'
                    ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
                <div className={`flex items-center justify-end mt-2 text-xs ${
                  message.sender === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - 15% */}
      <div className="mt-4" style={{ height: '15%' }}>
        <form onSubmit={handleSendMessage} className="mb-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share your thoughts or ask for support..."
              className="flex-1 p-4 rounded-xl border border-purple-200 dark:border-purple-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Helpful Tips */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-start space-x-3">
            <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">
                <strong>Remember:</strong> This AI is designed to provide support and coping strategies, 
                but it's not a replacement for professional mental health care. If you\'re experiencing 
                a crisis, please reach out to emergency services or a mental health professional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;