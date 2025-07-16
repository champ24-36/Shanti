// AI Content Service for generating mental health resources
// Note: In production, replace with actual API calls to ChatGPT and ElevenLabs

interface AIGeneratedContent {
  id: string;
  title: string;
  script: string;
  audioUrl?: string;
  duration: string;
  category: 'meditation' | 'breathing' | 'education' | 'exercise';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

class AIContentService {
  private apiKey: string = '';
  private elevenLabsKey: string = '';

  // Simulated ChatGPT API call for generating scripts
  async generateScript(topic: string, duration: number, category: string): Promise<string> {
    // In production, this would call the actual ChatGPT API
    const scripts: Record<string, string> = {
      'anxiety-breathing': `
        Welcome to this gentle breathing exercise designed to help ease anxiety and bring you back to a place of calm.
        
        Find a comfortable position, either sitting or lying down. Allow your eyes to close gently, or soften your gaze downward.
        
        Let's begin by simply noticing your breath as it is right now. There's no need to change anything yet - just observe.
        
        Now, we'll practice the 4-7-8 breathing technique. This ancient practice helps activate your body's natural relaxation response.
        
        Breathe in through your nose for a count of 4... 1, 2, 3, 4.
        Hold your breath gently for 7 counts... 1, 2, 3, 4, 5, 6, 7.
        Exhale slowly through your mouth for 8 counts... 1, 2, 3, 4, 5, 6, 7, 8.
        
        Let's repeat this cycle three more times, allowing each breath to carry away tension and worry.
        
        Remember, you are safe in this moment. You are exactly where you need to be.
      `,
      'depression-support': `
        Hello, and thank you for taking this time for yourself. That itself is an act of courage and self-compassion.
        
        Depression can feel like a heavy fog that makes everything seem distant and difficult. But you are not alone in this experience.
        
        Today, let's focus on small, gentle steps toward healing. Sometimes the most powerful thing we can do is simply acknowledge where we are without judgment.
        
        Take a moment to place one hand on your heart and one on your belly. Feel the warmth of your own touch - this is you caring for yourself.
        
        Breathe naturally and repeat these words silently: "I am worthy of love and care. I am doing the best I can. This feeling will pass."
        
        Depression often tells us lies about our worth and our future. But feelings, even the most difficult ones, are temporary visitors.
        
        You have survived difficult days before, and you have the strength to navigate this one too.
      `,
      'mindfulness-meditation': `
        Welcome to this mindfulness meditation. This is your time to pause, breathe, and reconnect with the present moment.
        
        Begin by finding a comfortable position. Allow your spine to be straight but not rigid, like a mountain - grounded yet reaching upward.
        
        Close your eyes or soften your gaze. Take three deep breaths, letting each exhale release any tension you've been carrying.
        
        Now, bring your attention to your breath. Notice the sensation of air entering your nostrils, filling your lungs, and gently leaving your body.
        
        Your mind will naturally wander - this is not a problem. When you notice thoughts arising, simply acknowledge them with kindness and gently return your attention to your breath.
        
        Think of your breath as an anchor, always available to bring you back to this moment of peace and presence.
        
        Continue breathing naturally, allowing yourself to rest in this space of awareness and calm.
      `,
      'sleep-preparation': `
        Welcome to this peaceful sleep preparation meditation. It's time to let go of the day and prepare your mind and body for restorative rest.
        
        Begin by making yourself comfortable in your bed. Adjust your pillows and blankets so you feel completely supported.
        
        Take a deep breath in, and as you exhale, allow your body to sink deeper into your mattress. Feel yourself being held and supported.
        
        Starting from the top of your head, we'll gently release tension from each part of your body.
        
        Relax your forehead, let your eyes grow heavy, soften your jaw. Allow your shoulders to drop away from your ears.
        
        Feel your arms becoming heavy and relaxed. Let your chest rise and fall naturally with each peaceful breath.
        
        Release any tension in your back, your hips, your legs. Feel your whole body melting into comfort and ease.
        
        As you drift toward sleep, know that you are safe, you are peaceful, and you deserve this rest.
      `
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return scripts[topic] || scripts['mindfulness-meditation'];
  }

  // Simulated ElevenLabs API call for generating audio
  async generateAudio(script: string, voice: string = 'calm-female'): Promise<string> {
    // In production, this would call the actual ElevenLabs API
    // For now, return a placeholder audio URL
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a data URL for a simple audio tone (placeholder)
    return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
  }

  // Generate complete AI content with script and audio
  async generateContent(
    topic: string, 
    duration: number, 
    category: 'meditation' | 'breathing' | 'education' | 'exercise',
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner'
  ): Promise<AIGeneratedContent> {
    try {
      const script = await this.generateScript(topic, duration, category);
      const audioUrl = await this.generateAudio(script);
      
      return {
        id: `ai-${Date.now()}`,
        title: this.generateTitle(topic, category),
        script,
        audioUrl,
        duration: `${duration} min`,
        category,
        difficulty
      };
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw new Error('Failed to generate content');
    }
  }

  // Generate personalized content based on user data
  async generatePersonalizedContent(
    userMood: string,
    recentJournalEntries: string[],
    stressLevel: number
  ): Promise<AIGeneratedContent> {
    let topic = 'mindfulness-meditation';
    let category: 'meditation' | 'breathing' | 'education' | 'exercise' = 'meditation';
    
    // Determine content based on user state
    if (stressLevel > 7) {
      topic = 'anxiety-breathing';
      category = 'breathing';
    } else if (userMood === 'sad' || userMood === 'depressed') {
      topic = 'depression-support';
      category = 'education';
    } else if (recentJournalEntries.some(entry => 
      entry.toLowerCase().includes('sleep') || entry.toLowerCase().includes('tired')
    )) {
      topic = 'sleep-preparation';
      category = 'meditation';
    }
    
    return this.generateContent(topic, 10, category);
  }

  private generateTitle(topic: string, category: string): string {
    const titles: Record<string, string> = {
      'anxiety-breathing': 'Calming Breath for Anxiety Relief',
      'depression-support': 'Gentle Support for Difficult Days',
      'mindfulness-meditation': 'Present Moment Awareness',
      'sleep-preparation': 'Peaceful Sleep Meditation'
    };
    
    return titles[topic] || `${category.charAt(0).toUpperCase() + category.slice(1)} Practice`;
  }

  // Get pre-generated content library
  getContentLibrary(): AIGeneratedContent[] {
    return [
      {
        id: 'ai-1',
        title: 'Morning Mindfulness',
        script: 'A gentle way to start your day with intention and peace...',
        audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        duration: '8 min',
        category: 'meditation',
        difficulty: 'Beginner'
      },
      {
        id: 'ai-2',
        title: 'Stress Relief Breathing',
        script: 'Quick and effective breathing techniques for immediate stress relief...',
        audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        duration: '5 min',
        category: 'breathing',
        difficulty: 'Beginner'
      },
      {
        id: 'ai-3',
        title: 'Understanding Anxiety',
        script: 'Learn about anxiety, its symptoms, and healthy coping strategies...',
        audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        duration: '12 min',
        category: 'education',
        difficulty: 'Beginner'
      },
      {
        id: 'ai-4',
        title: 'Gentle Movement for Mental Health',
        script: 'Simple, mindful movements to boost mood and reduce tension...',
        audioUrl: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
        duration: '15 min',
        category: 'exercise',
        difficulty: 'Beginner'
      }
    ];
  }
}

export const aiContentService = new AIContentService();
export type { AIGeneratedContent };