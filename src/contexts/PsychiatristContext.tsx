import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface Psychiatrist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  experience: number;
  languages: string[];
  availability: 'available' | 'busy' | 'offline';
  nextAvailable: Date;
  profileImage: string;
  bio: string;
  sessionTypes: ('video' | 'audio' | 'chat')[];
  hourlyRate: number;
}

interface Appointment {
  id: string;
  psychiatristId: string;
  userId: string;
  date: Date;
  duration: number;
  type: 'video' | 'audio' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  sessionUrl?: string;
}

interface PsychiatristContextType {
  psychiatrists: Psychiatrist[];
  appointments: Appointment[];
  isLoading: boolean;
  searchPsychiatrists: (specialty?: string, availability?: boolean) => Psychiatrist[];
  scheduleAppointment: (psychiatristId: string, date: Date, type: 'video' | 'audio' | 'chat') => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  startEmergencySession: () => Promise<void>;
  getAvailableSlots: (psychiatristId: string, date: Date) => Date[];
  connectToSession: (appointmentId: string) => Promise<string>;
}

const PsychiatristContext = createContext<PsychiatristContextType | undefined>(undefined);

export function usePsychiatrist() {
  const context = useContext(PsychiatristContext);
  if (context === undefined) {
    throw new Error('usePsychiatrist must be used within a PsychiatristProvider');
  }
  return context;
}

export function PsychiatristProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPsychiatrists();
      loadAppointments();
    }
  }, [user]);

  const loadPsychiatrists = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPsychiatrists: Psychiatrist[] = [
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          title: 'Licensed Psychiatrist, MD',
          specialties: ['Anxiety Disorders', 'Depression', 'PTSD'],
          rating: 4.9,
          experience: 12,
          languages: ['English', 'Mandarin'],
          availability: 'available',
          nextAvailable: new Date(Date.now() + 2 * 60 * 60 * 1000),
          profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Dr. Chen specializes in anxiety and mood disorders with a focus on mindfulness-based therapy.',
          sessionTypes: ['video', 'audio', 'chat'],
          hourlyRate: 150
        },
        {
          id: '2',
          name: 'Dr. Michael Rodriguez',
          title: 'Clinical Psychologist, PhD',
          specialties: ['Trauma Therapy', 'Addiction', 'Family Counseling'],
          rating: 4.8,
          experience: 8,
          languages: ['English', 'Spanish'],
          availability: 'busy',
          nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000),
          profileImage: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Dr. Rodriguez uses evidence-based approaches to help clients overcome trauma and addiction.',
          sessionTypes: ['video', 'audio'],
          hourlyRate: 140
        },
        {
          id: '3',
          name: 'Dr. Emily Johnson',
          title: 'Licensed Therapist, LCSW',
          specialties: ['Teen Counseling', 'Eating Disorders', 'Self-Esteem'],
          rating: 4.7,
          experience: 6,
          languages: ['English'],
          availability: 'available',
          nextAvailable: new Date(Date.now() + 4 * 60 * 60 * 1000),
          profileImage: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Dr. Johnson specializes in working with adolescents and young adults facing identity and self-worth challenges.',
          sessionTypes: ['video', 'chat'],
          hourlyRate: 120
        },
        {
          id: '4',
          name: 'Dr. David Kim',
          title: 'Psychiatrist, MD, PhD',
          specialties: ['Bipolar Disorder', 'Schizophrenia', 'Medication Management'],
          rating: 4.9,
          experience: 15,
          languages: ['English', 'Korean'],
          availability: 'available',
          nextAvailable: new Date(Date.now() + 1 * 60 * 60 * 1000),
          profileImage: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Dr. Kim is an expert in severe mental health conditions and psychiatric medication management.',
          sessionTypes: ['video', 'audio'],
          hourlyRate: 180
        }
      ];
      
      setPsychiatrists(mockPsychiatrists);
    } catch (error) {
      toast.error('Failed to load psychiatrists');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      // Simulate loading user appointments
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          psychiatristId: '1',
          userId: user?.id || '',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 50,
          type: 'video',
          status: 'scheduled',
          sessionUrl: 'https://meet.shanti.app/session/1'
        }
      ];
      
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  const searchPsychiatrists = (specialty?: string, availability?: boolean) => {
    return psychiatrists.filter(psychiatrist => {
      if (specialty && !psychiatrist.specialties.some(s => 
        s.toLowerCase().includes(specialty.toLowerCase())
      )) {
        return false;
      }
      
      if (availability && psychiatrist.availability !== 'available') {
        return false;
      }
      
      return true;
    });
  };

  const scheduleAppointment = async (
    psychiatristId: string, 
    date: Date, 
    type: 'video' | 'audio' | 'chat'
  ) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        psychiatristId,
        userId: user?.id || '',
        date,
        duration: 50,
        type,
        status: 'scheduled',
        sessionUrl: `https://meet.shanti.app/session/${Date.now()}`
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      toast.success('Appointment scheduled successfully!');
    } catch (error) {
      toast.error('Failed to schedule appointment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      ));
      
      toast.success('Appointment cancelled');
    } catch (error) {
      toast.error('Failed to cancel appointment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startEmergencySession = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Find available crisis counselor
      const crisisCounselor = psychiatrists.find(p => 
        p.availability === 'available' && 
        p.specialties.includes('PTSD')
      );
      
      if (crisisCounselor) {
        const emergencyAppointment: Appointment = {
          id: `emergency-${Date.now()}`,
          psychiatristId: crisisCounselor.id,
          userId: user?.id || '',
          date: new Date(),
          duration: 30,
          type: 'video',
          status: 'in-progress',
          sessionUrl: `https://meet.shanti.app/emergency/${Date.now()}`
        };
        
        setAppointments(prev => [...prev, emergencyAppointment]);
        toast.success('Connected to emergency counselor');
        
        // Open session in new window
        window.open(emergencyAppointment.sessionUrl, '_blank');
      } else {
        toast.error('No counselors available. Please call emergency services.');
      }
    } catch (error) {
      toast.error('Failed to start emergency session');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSlots = (psychiatristId: string, date: Date): Date[] => {
    // Generate available time slots for the day
    const slots: Date[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      
      // Check if slot is not already booked
      const isBooked = appointments.some(apt => 
        apt.psychiatristId === psychiatristId &&
        apt.date.getTime() === slot.getTime() &&
        apt.status !== 'cancelled'
      );
      
      if (!isBooked && slot > new Date()) {
        slots.push(slot);
      }
    }
    
    return slots;
  };

  const connectToSession = async (appointmentId: string): Promise<string> => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    // Update appointment status
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'in-progress' as const }
        : apt
    ));
    
    return appointment.sessionUrl || '';
  };

  return (
    <PsychiatristContext.Provider value={{
      psychiatrists,
      appointments,
      isLoading,
      searchPsychiatrists,
      scheduleAppointment,
      cancelAppointment,
      startEmergencySession,
      getAvailableSlots,
      connectToSession
    }}>
      {children}
    </PsychiatristContext.Provider>
  );
}