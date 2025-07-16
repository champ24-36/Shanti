import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Waves,
  TreePine,
  Cloud,
  Wind,
  Zap,
  Coffee
} from 'lucide-react';

interface AmbientSound {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  audioUrl: string;
  color: string;
}

const AmbientSounds: React.FC = () => {
  const [playingSounds, setPlayingSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const sounds: AmbientSound[] = [
    {
      id: 'ocean',
      name: 'Ocean Waves',
      icon: Waves,
      description: 'Gentle ocean waves for deep relaxation',
      audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'forest',
      name: 'Forest Sounds',
      icon: TreePine,
      description: 'Birds chirping and leaves rustling',
      audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'rain',
      name: 'Gentle Rain',
      icon: Cloud,
      description: 'Soft rainfall for peaceful sleep',
      audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      color: 'from-gray-400 to-blue-400'
    },
    {
      id: 'wind',
      name: 'Gentle Wind',
      icon: Wind,
      description: 'Soft wind through trees',
      audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'thunder',
      name: 'Distant Thunder',
      icon: Zap,
      description: 'Gentle thunder for deep focus',
      audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      color: 'from-indigo-400 to-purple-400'
    },
    {
      id: 'cafe',
      name: 'Coffee Shop',
      icon: Coffee,
      description: 'Ambient cafe sounds for productivity',
      audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      color: 'from-amber-400 to-orange-400'
    }
  ];

  useEffect(() => {
    // Initialize audio elements
    sounds.forEach(sound => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio();
        audio.loop = true;
        audio.volume = 0.5;
        audioRefs.current[sound.id] = audio;
        setVolumes(prev => ({ ...prev, [sound.id]: 50 }));
      }
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const toggleSound = (soundId: string) => {
    const audio = audioRefs.current[soundId];
    if (!audio) return;

    if (playingSounds.has(soundId)) {
      audio.pause();
      setPlayingSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundId);
        return newSet;
      });
    } else {
      // Simulate audio playback (in real app, use actual audio files)
      audio.play().catch(() => {
        // Fallback for demo - just update state
        console.log(`Playing ${soundId} sound`);
      });
      setPlayingSounds(prev => new Set([...prev, soundId]));
    }
  };

  const adjustVolume = (soundId: string, volume: number) => {
    const audio = audioRefs.current[soundId];
    if (audio) {
      audio.volume = volume / 100;
    }
    setVolumes(prev => ({ ...prev, [soundId]: volume }));
  };

  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
    });
    setPlayingSounds(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Ambient Sounds</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Create your perfect soundscape for relaxation and focus
        </p>
        
        {playingSounds.size > 0 && (
          <button
            onClick={stopAllSounds}
            className="btn-primary mb-4"
          >
            Stop All Sounds
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sounds.map(sound => {
          const Icon = sound.icon;
          const isPlaying = playingSounds.has(sound.id);
          const volume = volumes[sound.id] || 50;

          return (
            <motion.div
              key={sound.id}
              className="ambient-control"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${sound.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{sound.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {sound.description}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => toggleSound(sound.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isPlaying 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </motion.button>
              </div>

              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-4 h-4 text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => adjustVolume(sound.id, parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-8">{volume}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <motion.div
                      className={`h-1 bg-gradient-to-r ${sound.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-start space-x-3">
          <Volume2 className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
              Sound Mixing Tips
            </h4>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Combine 2-3 sounds for a rich soundscape</li>
              <li>• Lower volumes create subtle background ambience</li>
              <li>• Ocean + Rain works great for sleep</li>
              <li>• Forest + Wind is perfect for meditation</li>
              <li>• Cafe sounds help with focus and productivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbientSounds;