import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  Video, 
  Phone, 
  MessageSquare, 
  Star, 
  Clock, 
  Calendar,
  Search,
  Filter,
  AlertTriangle,
  Heart,
  CheckCircle,
  X,
  MapPin,
  Award,
  Languages
} from 'lucide-react';
import { usePsychiatrist } from '../contexts/PsychiatristContext';
import { format, addDays, isSameDay } from 'date-fns';
import toast from 'react-hot-toast';

const PsychiatristConnect: React.FC = () => {
  const { 
    psychiatrists, 
    appointments, 
    isLoading, 
    searchPsychiatrists, 
    scheduleAppointment, 
    startEmergencySession,
    getAvailableSlots,
    connectToSession
  } = usePsychiatrist();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [sessionType, setSessionType] = useState<'video' | 'audio' | 'chat'>('video');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const specialties = [
    'All Specialties',
    'Anxiety Disorders',
    'Depression',
    'PTSD',
    'Trauma Therapy',
    'Addiction',
    'Family Counseling',
    'Teen Counseling',
    'Eating Disorders',
    'Bipolar Disorder',
    'Schizophrenia'
  ];

  const filteredPsychiatrists = searchPsychiatrists(
    selectedSpecialty === 'All Specialties' ? undefined : selectedSpecialty,
    showAvailableOnly
  ).filter(psychiatrist =>
    psychiatrist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    psychiatrist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && apt.date > new Date()
  );

  const handleBookAppointment = async () => {
    if (!selectedPsychiatrist || !selectedTime) return;

    try {
      await scheduleAppointment(selectedPsychiatrist, selectedTime, sessionType);
      setShowBooking(false);
      setSelectedPsychiatrist(null);
      setSelectedTime(null);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleEmergencySession = async () => {
    try {
      await startEmergencySession();
      setShowEmergencyModal(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const getAvailableTimesForDate = (psychiatristId: string, date: Date) => {
    return getAvailableSlots(psychiatristId, date);
  };

  const getSessionTypeIcon = (type: 'video' | 'audio' | 'chat') => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Phone;
      case 'chat': return MessageSquare;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'busy': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'offline': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Connect with Licensed Psychiatrists
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get professional support from licensed mental health professionals. 
          Schedule sessions, connect instantly, or access emergency support when you need it most.
        </p>
      </motion.div>

      {/* Emergency Support Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Need Immediate Support?</h3>
              <p className="text-rose-100">
                Connect with a crisis counselor right now. Available 24/7 for emergency situations.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmergencyModal(true)}
            className="bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Emergency Support
          </motion.button>
        </div>
      </motion.div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sage-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => {
              const psychiatrist = psychiatrists.find(p => p.id === appointment.psychiatristId);
              if (!psychiatrist) return null;

              return (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-sage-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={psychiatrist.profileImage}
                      alt={psychiatrist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {psychiatrist.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {format(appointment.date, 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-sage-100 dark:bg-gray-600 text-sage-700 dark:text-sage-300 rounded-full text-sm">
                      {appointment.type}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => connectToSession(appointment.id)}
                      className="bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors"
                    >
                      Join Session
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search psychiatrists by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          
          <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
            />
            <span>Available now</span>
          </label>
        </div>
      </div>

      {/* Psychiatrists Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-lg border border-sage-100 dark:border-gray-700 animate-pulse"
            >
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))
        ) : filteredPsychiatrists.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No psychiatrists found
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        ) : (
          filteredPsychiatrists.map((psychiatrist) => (
            <motion.div
              key={psychiatrist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sage-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
            >
              {/* Profile Header */}
              <div className="text-center mb-4">
                <img
                  src={psychiatrist.profileImage}
                  alt={psychiatrist.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-sage-100 dark:border-gray-600"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {psychiatrist.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {psychiatrist.title}
                </p>
                
                {/* Availability Status */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(psychiatrist.availability)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    psychiatrist.availability === 'available' ? 'bg-green-500' :
                    psychiatrist.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  {psychiatrist.availability === 'available' ? 'Available Now' :
                   psychiatrist.availability === 'busy' ? 'Busy' : 'Offline'}
                </span>
              </div>

              {/* Rating and Experience */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {psychiatrist.rating}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                  <Award className="w-4 h-4" />
                  <span>{psychiatrist.experience} years</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {psychiatrist.specialties.slice(0, 2).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-sage-100 dark:bg-gray-700 text-sage-700 dark:text-sage-300 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                  {psychiatrist.specialties.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                      +{psychiatrist.specialties.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="flex items-center space-x-1 mb-4 text-sm text-gray-600 dark:text-gray-300">
                <Languages className="w-4 h-4" />
                <span>{psychiatrist.languages.join(', ')}</span>
              </div>

              {/* Session Types */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                {psychiatrist.sessionTypes.map((type) => {
                  const Icon = getSessionTypeIcon(type);
                  return (
                    <div
                      key={type}
                      className="p-2 bg-sage-50 dark:bg-gray-700 rounded-lg"
                      title={`${type} sessions available`}
                    >
                      <Icon className="w-4 h-4 text-sage-600 dark:text-sage-400" />
                    </div>
                  );
                })}
              </div>

              {/* Pricing */}
              <div className="text-center mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${psychiatrist.hourlyRate}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">/hour</span>
              </div>

              {/* Next Available */}
              <div className="text-center mb-4 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 inline mr-1" />
                Next available: {format(psychiatrist.nextAvailable, 'MMM d, h:mm a')}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPsychiatrist(psychiatrist.id);
                    setShowBooking(true);
                  }}
                  className="w-full bg-gradient-to-r from-sage-600 to-lavender-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Schedule Appointment
                </motion.button>
                
                {psychiatrist.availability === 'available' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white dark:bg-gray-700 border-2 border-sage-200 dark:border-gray-600 text-sage-700 dark:text-sage-300 py-2 rounded-xl font-medium hover:bg-sage-50 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Connect Now
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && selectedPsychiatrist && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {(() => {
                const psychiatrist = psychiatrists.find(p => p.id === selectedPsychiatrist);
                if (!psychiatrist) return null;

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Book Appointment
                      </h3>
                      <button
                        onClick={() => setShowBooking(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Psychiatrist Info */}
                    <div className="flex items-center space-x-4 mb-6 p-4 bg-sage-50 dark:bg-gray-700 rounded-xl">
                      <img
                        src={psychiatrist.profileImage}
                        alt={psychiatrist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {psychiatrist.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">{psychiatrist.title}</p>
                        <p className="text-sage-600 dark:text-sage-400 font-medium">
                          ${psychiatrist.hourlyRate}/hour
                        </p>
                      </div>
                    </div>

                    {/* Session Type Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Session Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {psychiatrist.sessionTypes.map((type) => {
                          const Icon = getSessionTypeIcon(type);
                          return (
                            <button
                              key={type}
                              onClick={() => setSessionType(type)}
                              className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                                sessionType === type
                                  ? 'border-sage-500 bg-sage-50 dark:bg-sage-900 text-sage-700 dark:text-sage-300'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-sage-500'
                              }`}
                            >
                              <Icon className="w-6 h-6 mx-auto mb-2" />
                              <span className="text-sm font-medium capitalize">{type}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Select Date
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 14 }, (_, i) => {
                          const date = addDays(new Date(), i);
                          const isSelected = isSameDay(date, selectedDate);
                          const isToday = isSameDay(date, new Date());
                          
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedDate(date)}
                              className={`p-3 text-center rounded-lg transition-all duration-200 ${
                                isSelected
                                  ? 'bg-sage-600 text-white'
                                  : isToday
                                  ? 'bg-sage-100 dark:bg-sage-800 text-sage-700 dark:text-sage-300'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {format(date, 'EEE')}
                              </div>
                              <div className="font-medium">
                                {format(date, 'd')}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Available Times
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {getAvailableTimesForDate(psychiatrist.id, selectedDate).map((time) => (
                          <button
                            key={time.getTime()}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 text-center rounded-lg transition-all duration-200 ${
                              selectedTime?.getTime() === time.getTime()
                                ? 'bg-sage-600 text-white'
                                : 'border border-gray-200 dark:border-gray-600 hover:border-sage-300 dark:hover:border-sage-500'
                            }`}
                          >
                            {format(time, 'h:mm a')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBookAppointment}
                      disabled={!selectedTime || isLoading}
                      className="w-full bg-gradient-to-r from-sage-600 to-lavender-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Booking...
                        </div>
                      ) : (
                        `Book Appointment - $${psychiatrist.hourlyRate}`
                      )}
                    </motion.button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Emergency Support
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You'll be connected with a crisis counselor immediately. 
                  This service is available 24/7 for urgent mental health support.
                </p>
                
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEmergencySession}
                    disabled={isLoading}
                    className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Now'}
                  </motion.button>
                  
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                  <p className="text-sm text-rose-700 dark:text-rose-300">
                    <strong>Crisis Hotlines:</strong><br />
                    National: 988<br />
                    Crisis Text: Text HOME to 741741
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PsychiatristConnect;