import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3,
  BookOpen,
  Headphones,
  ArrowRight,
  Star,
  Check,
  UserCheck,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: 'Peaceful Mood Tracking',
      description: 'Gently monitor your emotional journey with mindful insights and compassionate AI guidance.'
    },
    {
      icon: BookOpen,
      title: 'Mindful Journaling',
      description: 'Express yourself in a safe space with AI-powered emotional understanding and gentle reflections.'
    },
    {
      icon: Users,
      title: 'Supportive Community',
      description: 'Connect with others on similar paths in a carefully moderated, healing-focused environment.'
    },
    {
      icon: MessageSquare,
      title: 'AI Companion',
      description: '24/7 compassionate support with crisis intervention and personalized wellness guidance.'
    },
    {
      icon: UserCheck,
      title: 'Licensed Psychiatrists',
      description: 'Connect with qualified mental health professionals for video, audio, or chat sessions.'
    },
    {
      icon: Headphones,
      title: 'Healing Resources',
      description: 'Access meditation, breathing exercises, and therapeutic content designed for inner peace.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your healing journey is protected with end-to-end encryption and complete confidentiality.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya S.',
      role: 'Student',
      content: 'Shanti helped me find peace during my most challenging times. The gentle approach made all the difference.',
      rating: 5
    },
    {
      name: 'David M.',
      role: 'Professional',
      content: 'The connection with licensed psychiatrists was seamless. I finally found the support I needed.',
      rating: 5
    },
    {
      name: 'Sarah L.',
      role: 'Parent',
      content: 'A truly compassionate platform that understands the importance of mental wellness and healing.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 dark:from-sage-900 dark:via-gray-900 dark:to-lavender-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-sage-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sage-600 to-lavender-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Shanti</span>
              <span className="text-xs text-sage-600 dark:text-sage-400 font-medium">Find Your Peace</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 text-gray-400 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              
              <Link
                to="/auth"
                className="text-sage-700 dark:text-sage-300 hover:text-sage-900 dark:hover:text-sage-100 font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-sage-600 to-lavender-600 rounded-2xl flex items-center justify-center shadow-xl"
              >
                <Heart className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Find Your Inner
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-lavender-600">
                Peace & Healing
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Shanti offers a gentle, compassionate approach to mental wellness. 
              Connect with AI support, licensed psychiatrists, and a caring community 
              on your journey to emotional balance and inner peace.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sage-600 to-lavender-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-sage-200 dark:border-sage-700 text-sage-700 dark:text-sage-300 font-semibold rounded-xl hover:bg-sage-50 dark:hover:bg-sage-900 transition-all duration-200">
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Wellness Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every feature designed with compassion, mindfulness, and your emotional wellbeing at heart.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-sage-100 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-sage-600 to-lavender-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Stories of Healing & Hope
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real experiences from people who found peace and support through Shanti.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-sage-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sage-600 to-lavender-600 dark:from-sage-700 dark:to-lavender-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Journey to Peace Begins Today
            </h2>
            <p className="text-xl text-sage-100 mb-8">
              Join thousands who have found healing, support, and inner peace through Shanti's compassionate approach to mental wellness.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-white text-sage-600 font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Your Healing Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sage-600 to-lavender-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">Shanti</span>
              </div>
              <p className="text-gray-400">
                Compassionate AI-powered mental health support for everyone seeking peace and healing.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Dashboard</li>
                <li>Journal</li>
                <li>Community</li>
                <li>AI Support</li>
                <li>Psychiatrist Connect</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Crisis Support</li>
                <li>Mental Health Resources</li>
                <li>Meditation Library</li>
                <li>Professional Help</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shanti. All rights reserved. | Designed with compassion for mental wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;