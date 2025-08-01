'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { BrainGameScore } from '@/types';

type GameType = 'memory' | 'attention' | 'logic' | 'speed';

interface Game {
  type: GameType;
  title: string;
  description: string;
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MemoryGameState {
  sequence: number[];
  playerSequence: number[];
  currentStep: number;
  showingSequence: boolean;
  gameOver: boolean;
  score: number;
}

interface AttentionGameState {
  targetColor: string;
  colors: string[];
  timeLeft: number;
  score: number;
  gameOver: boolean;
  round: number;
}

interface LogicGameState {
  pattern: number[];
  options: number[];
  correctAnswer: number;
  score: number;
  round: number;
  gameOver: boolean;
}

interface SpeedGameState {
  equation: string;
  answer: number;
  userAnswer: string;
  score: number;
  timeLeft: number;
  gameOver: boolean;
}

const GAMES: Game[] = [
  {
    type: 'memory',
    title: 'Séquence Mémoire',
    description: 'Mémorisez et reproduisez la séquence de couleurs',
    emoji: '🧠',
    difficulty: 'medium',
  },
  {
    type: 'attention',
    title: 'Focus Couleur',
    description: 'Trouvez rapidement la couleur demandée',
    emoji: '🎯',
    difficulty: 'easy',
  },
  {
    type: 'logic',
    title: 'Suite Logique',
    description: 'Complétez la suite de nombres',
    emoji: '🔢',
    difficulty: 'hard',
  },
  {
    type: 'speed',
    title: 'Calcul Rapide',
    description: 'Résolvez les équations le plus vite possible',
    emoji: '⚡',
    difficulty: 'medium',
  },
];

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const COLOR_NAMES = {
  red: 'Rouge',
  blue: 'Bleu',
  green: 'Vert',
  yellow: 'Jaune',
  purple: 'Violet',
  orange: 'Orange',
};

export function BrainGame() {
  const { addBrainGameScore } = useApp();
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  // États des différents jeux
  const [memoryGame, setMemoryGame] = useState<MemoryGameState>({
    sequence: [],
    playerSequence: [],
    currentStep: 0,
    showingSequence: false,
    gameOver: false,
    score: 0,
  });

  const [attentionGame, setAttentionGame] = useState<AttentionGameState>({
    targetColor: '',
    colors: [],
    timeLeft: 30,
    score: 0,
    gameOver: false,
    round: 1,
  });

  const [logicGame, setLogicGame] = useState<LogicGameState>({
    pattern: [],
    options: [],
    correctAnswer: 0,
    score: 0,
    round: 1,
    gameOver: false,
  });

  const [speedGame, setSpeedGame] = useState<SpeedGameState>({
    equation: '',
    answer: 0,
    userAnswer: '',
    score: 0,
    timeLeft: 60,
    gameOver: false,
  });

  // Timer pour les jeux chronométrés
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !isGameOver()) {
      interval = setInterval(() => {
        setGameTime(prev => prev + 1);
        
        // Décrémenter le temps pour les jeux chronométrés
        if (selectedGame === 'attention') {
          setAttentionGame(prev => {
            if (prev.timeLeft <= 1) {
              return { ...prev, timeLeft: 0, gameOver: true };
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 };
          });
        } else if (selectedGame === 'speed') {
          setSpeedGame(prev => {
            if (prev.timeLeft <= 1) {
              return { ...prev, timeLeft: 0, gameOver: true };
            }
            return { ...prev, timeLeft: prev.timeLeft - 1 };
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, selectedGame]);

  const isGameOver = () => {
    switch (selectedGame) {
      case 'memory': return memoryGame.gameOver;
      case 'attention': return attentionGame.gameOver;
      case 'logic': return logicGame.gameOver;
      case 'speed': return speedGame.gameOver;
      default: return false;
    }
  };

  const getCurrentScore = () => {
    switch (selectedGame) {
      case 'memory': return memoryGame.score;
      case 'attention': return attentionGame.score;
      case 'logic': return logicGame.score;
      case 'speed': return speedGame.score;
      default: return 0;
    }
  };

  const getMaxScore = () => {
    switch (selectedGame) {
      case 'memory': return memoryGame.score * 2; // Score potentiel si on continue
      case 'attention': return 100; // Score maximum théorique
      case 'logic': return logicGame.round * 10; // 10 points par round
      case 'speed': return 100; // Score maximum théorique
      default: return 100;
    }
  };

  const startGame = (gameType: GameType) => {
    setSelectedGame(gameType);
    setGameStarted(true);
    setGameTime(0);
    
    switch (gameType) {
      case 'memory':
        initMemoryGame();
        break;
      case 'attention':
        initAttentionGame();
        break;
      case 'logic':
        initLogicGame();
        break;
      case 'speed':
        initSpeedGame();
        break;
    }
  };

  const endGame = () => {
    if (selectedGame && gameStarted) {
      const score = getCurrentScore();
      const maxScore = getMaxScore();
      
      // Enregistrer le score
      const gameScore: Omit<BrainGameScore, 'id'> = {
        gameType: selectedGame,
        score,
        maxScore,
        date: new Date(),
        duration: gameTime,
      };
      
      addBrainGameScore(gameScore);
    }
    
    resetGame();
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameStarted(false);
    setGameTime(0);
    
    // Reset tous les états
    setMemoryGame({
      sequence: [],
      playerSequence: [],
      currentStep: 0,
      showingSequence: false,
      gameOver: false,
      score: 0,
    });
    
    setAttentionGame({
      targetColor: '',
      colors: [],
      timeLeft: 30,
      score: 0,
      gameOver: false,
      round: 1,
    });
    
    setLogicGame({
      pattern: [],
      options: [],
      correctAnswer: 0,
      score: 0,
      round: 1,
      gameOver: false,
    });
    
    setSpeedGame({
      equation: '',
      answer: 0,
      userAnswer: '',
      score: 0,
      timeLeft: 60,
      gameOver: false,
    });
  };

  // Jeu de mémoire
  const initMemoryGame = () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setMemoryGame(prev => ({
      ...prev,
      sequence: newSequence,
      playerSequence: [],
      currentStep: 0,
      showingSequence: true,
      gameOver: false,
      score: 0,
    }));
    
    // Montrer la séquence
    setTimeout(() => {
      setMemoryGame(prev => ({ ...prev, showingSequence: false }));
    }, 1000 * newSequence.length + 500);
  };

  const handleMemoryClick = (index: number) => {
    if (memoryGame.showingSequence || memoryGame.gameOver) return;
    
    const newPlayerSequence = [...memoryGame.playerSequence, index];
    
    if (newPlayerSequence[memoryGame.currentStep] !== memoryGame.sequence[memoryGame.currentStep]) {
      // Erreur
      setMemoryGame(prev => ({ ...prev, gameOver: true }));
      return;
    }
    
    if (newPlayerSequence.length === memoryGame.sequence.length) {
      // Séquence complète réussie
      const newScore = memoryGame.score + memoryGame.sequence.length;
      const newSequence = [...memoryGame.sequence, Math.floor(Math.random() * 4)];
      
      setMemoryGame(prev => ({
        ...prev,
        sequence: newSequence,
        playerSequence: [],
        currentStep: 0,
        showingSequence: true,
        score: newScore,
      }));
      
      setTimeout(() => {
        setMemoryGame(prev => ({ ...prev, showingSequence: false }));
      }, 1000 * newSequence.length + 500);
    } else {
      setMemoryGame(prev => ({
        ...prev,
        playerSequence: newPlayerSequence,
        currentStep: prev.currentStep + 1,
      }));
    }
  };

  // Jeu d'attention
  const initAttentionGame = () => {
    generateAttentionRound();
  };

  const generateAttentionRound = () => {
    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
    
    setAttentionGame(prev => ({
      ...prev,
      targetColor,
      colors: shuffledColors,
    }));
  };

  const handleAttentionClick = (color: string) => {
    if (attentionGame.gameOver) return;
    
    if (color === attentionGame.targetColor) {
      const newScore = attentionGame.score + Math.max(1, Math.floor(attentionGame.timeLeft / 3));
      setAttentionGame(prev => ({
        ...prev,
        score: newScore,
        round: prev.round + 1,
      }));
      generateAttentionRound();
    } else {
      setAttentionGame(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 2),
      }));
    }
  };

  // Jeu de logique
  const initLogicGame = () => {
    generateLogicRound();
  };

  const generateLogicRound = () => {
    // Générer une suite arithmétique simple
    const start = Math.floor(Math.random() * 10) + 1;
    const step = Math.floor(Math.random() * 5) + 1;
    const length = 4;
    
    const pattern = Array.from({ length }, (_, i) => start + i * step);
    const correctAnswer = start + length * step;
    
    // Générer des options
    const options = [
      correctAnswer,
      correctAnswer + step,
      correctAnswer - step,
      correctAnswer + Math.floor(Math.random() * 10) + 1,
    ].sort(() => Math.random() - 0.5);
    
    setLogicGame(prev => ({
      ...prev,
      pattern,
      options,
      correctAnswer,
    }));
  };

  const handleLogicAnswer = (answer: number) => {
    if (logicGame.gameOver) return;
    
    if (answer === logicGame.correctAnswer) {
      const newScore = logicGame.score + 10;
      const newRound = logicGame.round + 1;
      
      if (newRound > 10) {
        setLogicGame(prev => ({ ...prev, score: newScore, gameOver: true }));
      } else {
        setLogicGame(prev => ({
          ...prev,
          score: newScore,
          round: newRound,
        }));
        setTimeout(generateLogicRound, 1000);
      }
    } else {
      setLogicGame(prev => ({ ...prev, gameOver: true }));
    }
  };

  // Jeu de vitesse
  const initSpeedGame = () => {
    generateSpeedEquation();
  };

  const generateSpeedEquation = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer: number;
    let equation: string;
    
    switch (operation) {
      case '+':
        answer = a + b;
        equation = `${a} + ${b}`;
        break;
      case '-':
        answer = Math.abs(a - b);
        equation = `${Math.max(a, b)} - ${Math.min(a, b)}`;
        break;
      case '*':
        const smallA = Math.floor(Math.random() * 10) + 1;
        const smallB = Math.floor(Math.random() * 10) + 1;
        answer = smallA * smallB;
        equation = `${smallA} × ${smallB}`;
        break;
      default:
        answer = a + b;
        equation = `${a} + ${b}`;
    }
    
    setSpeedGame(prev => ({
      ...prev,
      equation,
      answer,
      userAnswer: '',
    }));
  };

  const handleSpeedAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (speedGame.gameOver) return;
    
    const userNum = parseInt(speedGame.userAnswer);
    if (userNum === speedGame.answer) {
      const newScore = speedGame.score + Math.max(1, Math.floor(speedGame.timeLeft / 6));
      setSpeedGame(prev => ({ ...prev, score: newScore }));
      generateSpeedEquation();
    } else {
      setSpeedGame(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 1),
      }));
    }
  };

  if (!selectedGame) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Choisissez votre défi 🎮</h2>
          <p className="text-sm text-muted-foreground">
            Stimulez votre cerveau avec ces jeux adaptés
          </p>
        </div>
        
        <div className="grid gap-4">
          {GAMES.map((game) => (
            <Card key={game.type} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-4" onClick={() => startGame(game.type)}>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{game.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{game.title}</h3>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {game.difficulty === 'easy' && '🟢 Facile'}
                      {game.difficulty === 'medium' && '🟡 Moyen'}
                      {game.difficulty === 'hard' && '🔴 Difficile'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentGame = GAMES.find(g => g.type === selectedGame)!;

  return (
    <div className="space-y-6">
      {/* En-tête du jeu */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={resetGame}>
              ← Retour
            </Button>
            <div className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                {currentGame.emoji} {currentGame.title}
              </CardTitle>
              <CardDescription>Score: {getCurrentScore()}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interface du jeu */}
      {selectedGame === 'memory' && (
        <MemoryGameInterface 
          game={memoryGame} 
          onColorClick={handleMemoryClick}
          onEndGame={endGame}
        />
      )}
      
      {selectedGame === 'attention' && (
        <AttentionGameInterface 
          game={attentionGame} 
          onColorClick={handleAttentionClick}
          onEndGame={endGame}
        />
      )}
      
      {selectedGame === 'logic' && (
        <LogicGameInterface 
          game={logicGame} 
          onAnswer={handleLogicAnswer}
          onEndGame={endGame}
        />
      )}
      
      {selectedGame === 'speed' && (
        <SpeedGameInterface 
          game={speedGame} 
          onAnswer={handleSpeedAnswer}
          onAnswerChange={(value) => setSpeedGame(prev => ({ ...prev, userAnswer: value }))}
          onEndGame={endGame}
        />
      )}
    </div>
  );
}

// Interfaces des jeux individuels
function MemoryGameInterface({ 
  game, 
  onColorClick, 
  onEndGame 
}: { 
  game: MemoryGameState; 
  onColorClick: (index: number) => void;
  onEndGame: () => void;
}) {
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
  
  if (game.gameOver) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-bold">Jeu terminé !</h3>
          <p className="text-lg">Score final: {game.score}</p>
          <Button onClick={onEndGame}>Terminer</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {game.showingSequence ? 'Mémorisez la séquence...' : 'Reproduisez la séquence'}
          </p>
          <p className="text-lg font-bold">Niveau: {game.sequence.length}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color, index) => (
            <Button
              key={index}
              className={`h-20 ${color} ${
                game.showingSequence && game.sequence.includes(index) ? 'animate-pulse' : ''
              }`}
              onClick={() => onColorClick(index)}
              disabled={game.showingSequence}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AttentionGameInterface({ 
  game, 
  onColorClick, 
  onEndGame 
}: { 
  game: AttentionGameState; 
  onColorClick: (color: string) => void;
  onEndGame: () => void;
}) {
  if (game.gameOver) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-bold">Temps écoulé !</h3>
          <p className="text-lg">Score final: {game.score}</p>
          <Button onClick={onEndGame}>Terminer</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-lg font-bold">
            Trouvez: {COLOR_NAMES[game.targetColor as keyof typeof COLOR_NAMES]}
          </p>
          <Progress value={(game.timeLeft / 30) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Temps restant: {game.timeLeft}s | Round: {game.round}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {game.colors.map((color, index) => (
            <Button
              key={index}
              className={`h-16 bg-${color}-500 hover:bg-${color}-600`}
              onClick={() => onColorClick(color)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LogicGameInterface({ 
  game, 
  onAnswer, 
  onEndGame 
}: { 
  game: LogicGameState; 
  onAnswer: (answer: number) => void;
  onEndGame: () => void;
}) {
  if (game.gameOver) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-bold">
            {game.round > 10 ? 'Félicitations !' : 'Jeu terminé !'}
          </h3>
          <p className="text-lg">Score final: {game.score}</p>
          <Button onClick={onEndGame}>Terminer</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Round {game.round}/10</p>
          <p className="text-lg font-bold">Complétez la suite:</p>
        </div>
        
        <div className="flex justify-center gap-2 text-xl font-mono">
          {game.pattern.map((num, index) => (
            <span key={index} className="w-12 h-12 flex items-center justify-center bg-muted rounded">
              {num}
            </span>
          ))}
          <span className="w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded">
            ?
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {game.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-12 text-lg"
              onClick={() => onAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SpeedGameInterface({ 
  game, 
  onAnswer, 
  onAnswerChange, 
  onEndGame 
}: { 
  game: SpeedGameState; 
  onAnswer: (e: React.FormEvent) => void;
  onAnswerChange: (value: string) => void;
  onEndGame: () => void;
}) {
  if (game.gameOver) {
    return (
      <Card className="text-center">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-bold">Temps écoulé !</h3>
          <p className="text-lg">Score final: {game.score}</p>
          <Button onClick={onEndGame}>Terminer</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center space-y-2">
          <Progress value={(game.timeLeft / 60) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Temps restant: {game.timeLeft}s
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-mono font-bold mb-4">
            {game.equation} = ?
          </p>
          
          <form onSubmit={onAnswer} className="space-y-4">
            <input
              type="number"
              value={game.userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="w-full text-center text-xl p-3 border rounded-md"
              placeholder="Votre réponse"
              autoFocus
            />
            <Button type="submit" className="w-full">
              Valider
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
