import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Sparkles, 
  Circle,
  Square,
  Triangle,
  Star,
  Flower,
  Leaf,
  X 
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { name: 'inhale' as const, duration: 4000, nextCount: 4 },
      { name: 'hold' as const, duration: 4000, nextCount: 4 },
      { name: 'exhale' as const, duration: 4000, nextCount: 4 },
      { name: 'pause' as const, duration: 2000, nextCount: 4 }
    ];

    const currentPhase = phases.find(p => p.name === phase);
    if (!currentPhase) return;

    const timer = setTimeout(() => {
      const currentIndex = phases.findIndex(p => p.name === phase);
      const nextIndex = (currentIndex + 1) % phases.length;
      setPhase(phases[nextIndex].name);
      setCount(phases[nextIndex].nextCount);
    }, currentPhase.duration);

    const countTimer = setInterval(() => {
      setCount(prev => prev > 0 ? prev - 1 : currentPhase.nextCount);
    }, currentPhase.duration / currentPhase.nextCount);

    return () => {
      clearTimeout(timer);
      clearInterval(countTimer);
    };
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-pink-400';
      case 'exhale': return 'from-green-400 to-emerald-400';
      case 'pause': return 'from-gray-400 to-slate-400';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="relative">
        <motion.div
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl`}
          animate={{
            scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.8 : 1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <div className="text-center text-white">
            <p className="text-2xl font-bold mb-2">{getPhaseText()}</p>
            <p className="text-4xl font-bold">{count}</p>
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">4-4-4-4 Breathing</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Follow the circle and breathe deeply to reduce anxiety
        </p>
        
        <button
          onClick={() => setIsActive(!isActive)}
          className="btn-primary flex items-center space-x-2"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
      </div>
    </div>
  );
};
const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const winner = calculateWinner(board);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setXIsNext(true);
  };

  const renderSquare = (index: number) => (
    <button
      onClick={() => handleClick(index)}
      className="w-20 h-20 text-2xl font-bold border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition"
    >
      {board[index]}
    </button>
  );

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <h1 className="text-3xl font-semibold text-center">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
      </div>
      <div className="text-xl">
        {winner
          ? `Winner: ${winner}`
          : board.every(Boolean)
          ? 'Draw!'
          : `Next Player: ${xIsNext ? 'X' : 'O'}`}
      </div>
      <button
        onClick={resetGame}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Restart
      </button>
    </div>
  );
};

function calculateWinner(squares: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


const ZenGarden: React.FC = () => {
  const [stones, setStones] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');

  const colors = [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'
  ];

  const addStone = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStones(prev => [...prev, {
      id: Date.now(),
      x: x - 16,
      y: y - 16,
      color: selectedColor
    }]);
  };

  const clearGarden = () => {
    setStones([]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Digital Zen Garden</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Click to place stones and create your peaceful garden
        </p>
      </div>

      <div className="flex justify-center space-x-2 mb-4">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div
        className="relative w-full h-64 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700 cursor-crosshair overflow-hidden"
        onClick={addStone}
      >
        {stones.map(stone => (
          <motion.div
            key={stone.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute w-8 h-8 rounded-full shadow-lg"
            style={{
              left: stone.x,
              top: stone.y,
              backgroundColor: stone.color
            }}
          />
        ))}
        
        {stones.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Click anywhere to place stones
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={clearGarden}
          className="btn-primary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Garden</span>
        </button>
      </div>
    </div>
  );
};

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Array<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const icons = ['🌸', '🌿', '🦋', '🌙', '⭐', '🌊', '🍃', '🌺'];

  const initializeGame = () => {
    const gameCards = [...icons, ...icons].map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setIsComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].icon === cards[second].icon) {
        setCards(prev => prev.map(card => 
          card.id === first || card.id === second 
            ? { ...card, isMatched: true }
            : card
        ));
        setFlippedCards([]);
        
        if (cards.filter(card => !card.isMatched).length === 2) {
          setIsComplete(true);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Mindful Memory</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Match pairs of peaceful symbols to train focus and memory
        </p>
        <div className="flex justify-center space-x-4 text-gray-600 dark:text-gray-300 sm">
          <span>Moves: {moves}</span>
          {isComplete && (
            <span className="text-green-600 font-semibold">Completed! 🎉</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
        {cards.map(card => (
          <motion.div
            key={card.id}
            className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">
              {card.isFlipped || card.isMatched ? card.icon : '?'}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={initializeGame}
          className="btn-primary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};

const ColorTherapy: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [mood, setMood] = useState('');

  const colors = [
    { color: '#8b5cf6', name: 'Purple', mood: 'Spiritual & Calm' },
    { color: '#06b6d4', name: 'Cyan', mood: 'Peaceful & Clear' },
    { color: '#10b981', name: 'Green', mood: 'Balanced & Growing' },
    { color: '#f59e0b', name: 'Amber', mood: 'Warm & Energetic' },
    { color: '#ec4899', name: 'Pink', mood: 'Loving & Nurturing' },
    { color: '#6366f1', name: 'Indigo', mood: 'Wise & Intuitive' }
  ];

  const handleColorSelect = (color: { color: string; name: string; mood: string }) => {
    setSelectedColor(color.color);
    setMood(color.mood);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Color Therapy</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Choose colors that resonate with your current mood
        </p>
      </div>

      <motion.div
        className="w-48 h-48 rounded-full mx-auto shadow-2xl"
        style={{ backgroundColor: selectedColor }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {colors.map(color => (
          <motion.button
            key={color.color}
            onClick={() => handleColorSelect(color)}
            className="p-4 rounded-xl border-2 transition-all text-center"
            style={{
              backgroundColor: color.color + '20',
              borderColor: selectedColor === color.color ? color.color : 'transparent'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-8 h-8 rounded-full mx-auto mb-2"
              style={{ backgroundColor: color.color }}
            />
            <p className="text-sm font-medium">{color.name}</p>
          </motion.button>
        ))}
      </div>

      {mood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl"
        >
          <p className="text-lg font-medium">Current Energy: {mood}</p>
        </motion.div>
      )}
    </div>
  );
};

const InteractiveGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('breathing');

  const games: Game[] = [
    {
      id: 'breathing',
      name: 'Breathing Circle',
      description: 'Guided breathing exercise to reduce anxiety',
      icon: Circle,
      component: BreathingExercise
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Play a simple relaxing game with a Friend',
      icon: X ,
      component: TicTacToe
    },
    {
      id: 'zen',
      name: 'Zen Garden',
      description: 'Create peaceful patterns with digital stones',
      icon: Flower,
      component: ZenGarden
    },
    {
      id: 'memory',
      name: 'Mindful Memory',
      description: 'Memory game with calming symbols',
      icon: Star,
      component: MemoryGame
    },
    {
      id: 'color',
      name: 'Color Therapy',
      description: 'Explore colors and their emotional effects',
      icon: Heart,
      component: ColorTherapy
    }
  ];

  const selectedGameData = games.find(game => game.id === selectedGame);
  const GameComponent = selectedGameData?.component;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Mindful Games</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Interactive activities designed to reduce stress, improve focus, and promote mindfulness
        </p>
      </div>

      {/* Game Selection */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map(game => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`game-card text-left ${
                selectedGame === game.id ? 'ring-2 ring-purple-500' : ''
              }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold">{game.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {game.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Game */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-purple-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {GameComponent && <GameComponent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveGames;