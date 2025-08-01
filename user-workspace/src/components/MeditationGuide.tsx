'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { MeditationSession } from '@/types';

type MeditationType = 'breathing' | 'mindfulness' | 'body-scan';
type SessionPhase = 'setup' | 'active' | 'completed';

interface MeditationProgram {
  type: MeditationType;
  title: string;
  description: string;
  emoji: string;
  durations: number[]; // en minutes
  instructions: string[];
}

interface SessionState {
  phase: SessionPhase;
  timeLeft: number;
  totalTime: number;
  currentInstruction: number;
  isPlaying: boolean;
}

const MEDITATION_PROGRAMS: MeditationProgram[] = [
  {
    type: 'breathing',
    title: 'Respiration Guidée',
    description: 'Exercices de respiration pour réduire le stress',
    emoji: '🫁',
    durations: [3, 5, 10, 15],
    instructions: [
      'Installez-vous confortablement, le dos droit',
      'Fermez les yeux ou fixez un point devant vous',
      'Inspirez lentement par le nez pendant 4 secondes',
      'Retenez votre souffle pendant 4 secondes',
      'Expirez lentement par la bouche pendant 6 secondes',
      'Répétez ce cycle en vous concentrant sur votre respiration',
    ],
  },
  {
    type: 'mindfulness',
    title: 'Pleine Conscience',
    description: 'Méditation de pleine conscience pour l\'instant présent',
    emoji: '🧘‍♀️',
    durations: [5, 10, 15, 20],
    instructions: [
      'Asseyez-vous dans une position confortable',
      'Fermez les yeux et prenez trois respirations profondes',
      'Portez votre attention sur votre respiration naturelle',
      'Observez les sensations sans les juger',
      'Quand votre esprit divague, ramenez-le doucement à la respiration',
      'Restez présent à chaque instant',
    ],
  },
  {
    type: 'body-scan',
    title: 'Scan Corporel',
    description: 'Relaxation progressive de tout le corps',
    emoji: '🌊',
    durations: [10, 15, 20, 25],
    instructions: [
      'Allongez-vous confortablement sur le dos',
      'Fermez les yeux et respirez naturellement',
      'Commencez par porter attention à vos pieds',
      'Remontez progressivement vers votre tête',
      'Relâchez chaque partie de votre corps',
      'Sentez la détente se propager dans tout votre être',
    ],
  },
];

const BREATHING_PATTERNS = {
  '4-4-6': { inhale: 4, hold: 4, exhale: 6, name: 'Relaxation' },
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: 'Sommeil' },
  '6-2-6': { inhale: 6, hold: 2, exhale: 6, name: 'Équilibre' },
  '4-4-4': { inhale: 4, hold: 4, exhale: 4, name: 'Concentration' },
};

export function MeditationGuide() {
  const { addMeditationSession } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<MeditationType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(5);
  const [breathingPattern, setBreathingPattern] = useState<keyof typeof BREATHING_PATTERNS>('4-4-6');
  const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null);
  
  const [sessionState, setSessionState] = useState<SessionState>({
    phase: 'setup',
    timeLeft: 0,
    totalTime: 0,
    currentInstruction: 0,
    isPlaying: false,
  });

  // État pour l'exercice de respiration
  const [breathingState, setBreathingState] = useState<{
    phase: 'inhale' | 'hold' | 'exhale';
    timeLeft: number;
    cycle: number;
  }>({
    phase: 'inhale',
    timeLeft: 0,
    cycle: 0,
  });

  // Timer principal de la session
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionState.isPlaying && sessionState.timeLeft > 0) {
      interval = setInterval(() => {
        setSessionState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            // Session terminée
            handleSessionComplete();
            return {
              ...prev,
              timeLeft: 0,
              phase: 'completed',
              isPlaying: false,
            };
          }

          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionState.isPlaying, sessionState.timeLeft]);

  // Timer pour l'exercice de respiration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (selectedProgram === 'breathing' && sessionState.isPlaying) {
      const pattern = BREATHING_PATTERNS[breathingPattern];
      
      interval = setInterval(() => {
        setBreathingState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          
          if (newTimeLeft <= 0) {
            // Passer à la phase suivante
            let nextPhase: 'inhale' | 'hold' | 'exhale';
            let nextTime: number;
            let nextCycle = prev.cycle;
            
            switch (prev.phase) {
              case 'inhale':
                nextPhase = 'hold';
                nextTime = pattern.hold;
                break;
              case 'hold':
                nextPhase = 'exhale';
                nextTime = pattern.exhale;
                break;
              case 'exhale':
                nextPhase = 'inhale';
                nextTime = pattern.inhale;
                nextCycle = prev.cycle + 1;
                break;
            }
            
            return {
              phase: nextPhase,
              timeLeft: nextTime,
              cycle: nextCycle,
            };
          }
          
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedProgram, sessionState.isPlaying, breathingPattern]);

  const handleSessionComplete = () => {
    if (currentSession) {
      // Enregistrer la session comme complétée
      addMeditationSession({
        ...currentSession,
        completed: true,
      });
    }
  };

  const startSession = () => {
    if (!selectedProgram) return;

    const newSession: Omit<MeditationSession, 'id'> = {
      type: selectedProgram,
      duration: selectedDuration,
      date: new Date(),
      completed: false,
    };

    setCurrentSession(newSession as MeditationSession);
    
    setSessionState({
      phase: 'active',
      timeLeft: selectedDuration * 60,
      totalTime: selectedDuration * 60,
      currentInstruction: 0,
      isPlaying: true,
    });

    // Initialiser l'état de respiration si nécessaire
    if (selectedProgram === 'breathing') {
      const pattern = BREATHING_PATTERNS[breathingPattern];
      setBreathingState({
        phase: 'inhale',
        timeLeft: pattern.inhale,
        cycle: 0,
      });
    }
  };

  const pauseSession = () => {
    setSessionState(prev => ({ ...prev, isPlaying: false }));
  };

  const resumeSession = () => {
    setSessionState(prev => ({ ...prev, isPlaying: true }));
  };

  const endSession = () => {
    if (currentSession) {
      handleSessionComplete();
    }
    
    resetSession();
  };

  const resetSession = () => {
    setSelectedProgram(null);
    setCurrentSession(null);
    setSessionState({
      phase: 'setup',
      timeLeft: 0,
      totalTime: 0,
      currentInstruction: 0,
      isPlaying: false,
    });
    setBreathingState({
      phase: 'inhale',
      timeLeft: 0,
      cycle: 0,
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (sessionState.totalTime === 0) return 0;
    return ((sessionState.totalTime - sessionState.timeLeft) / sessionState.totalTime) * 100;
  };

  const getPhaseText = () => {
    switch (breathingState.phase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
    }
  };

  const getPhaseColor = () => {
    switch (breathingState.phase) {
      case 'inhale': return 'bg-blue-500';
      case 'hold': return 'bg-yellow-500';
      case 'exhale': return 'bg-green-500';
    }
  };

  // Phase de configuration
  if (sessionState.phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">Choisissez votre pratique 🧘‍♀️</h2>
          <p className="text-sm text-muted-foreground">
            Prenez un moment pour vous détendre et vous recentrer
          </p>
        </div>

        {/* Sélection du programme */}
        <div className="space-y-3">
          {MEDITATION_PROGRAMS.map((program) => (
            <Card 
              key={program.type} 
              className={`cursor-pointer transition-all ${
                selectedProgram === program.type 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedProgram(program.type)}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{program.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{program.title}</h3>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </div>
                  {selectedProgram === program.type && (
                    <Badge variant="default">Sélectionné</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configuration de la session */}
        {selectedProgram && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Durée */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Durée de la session
                </label>
                <Select
                  value={selectedDuration.toString()}
                  onValueChange={(value) => setSelectedDuration(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDITATION_PROGRAMS
                      .find(p => p.type === selectedProgram)
                      ?.durations.map((duration) => (
                        <SelectItem key={duration} value={duration.toString()}>
                          {duration} minute{duration > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pattern de respiration pour les exercices de respiration */}
              {selectedProgram === 'breathing' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rythme de respiration
                  </label>
                  <Select
                    value={breathingPattern}
                    onValueChange={(value: keyof typeof BREATHING_PATTERNS) => 
                      setBreathingPattern(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BREATHING_PATTERNS).map(([key, pattern]) => (
                        <SelectItem key={key} value={key}>
                          {pattern.name} ({key})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={startSession} className="w-full">
                Commencer la session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Phase active
  if (sessionState.phase === 'active') {
    const currentProgram = MEDITATION_PROGRAMS.find(p => p.type === selectedProgram)!;

    return (
      <div className="space-y-6">
        {/* En-tête de session */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={endSession}>
                ← Arrêter
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2 justify-center">
                  {currentProgram.emoji} {currentProgram.title}
                </CardTitle>
                <CardDescription>
                  {formatTime(sessionState.timeLeft)} restant
                </CardDescription>
              </div>
              <div className="w-16"></div>
            </div>
            <Progress value={getProgressPercentage()} className="h-2 mt-4" />
          </CardHeader>
        </Card>

        {/* Interface spécifique au type de méditation */}
        {selectedProgram === 'breathing' && (
          <Card className="text-center">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className={`w-32 h-32 mx-auto rounded-full ${getPhaseColor()} flex items-center justify-center text-white font-bold text-xl transition-all duration-1000 ${
                  breathingState.phase === 'inhale' ? 'scale-110' : 
                  breathingState.phase === 'exhale' ? 'scale-90' : 'scale-100'
                }`}>
                  {getPhaseText()}
                </div>
                
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {breathingState.timeLeft}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cycle {breathingState.cycle + 1}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedProgram !== 'breathing' && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-4">
                <div className="text-6xl">{currentProgram.emoji}</div>
                <div className="space-y-2">
                  {currentProgram.instructions.map((instruction, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {instruction}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contrôles */}
        <div className="flex justify-center gap-3">
          {sessionState.isPlaying ? (
            <Button onClick={pauseSession} variant="outline" size="lg">
              Pause
            </Button>
          ) : (
            <Button onClick={resumeSession} size="lg">
              Reprendre
            </Button>
          )}
          <Button onClick={endSession} variant="outline" size="lg">
            Terminer
          </Button>
        </div>
      </div>
    );
  }

  // Phase terminée
  if (sessionState.phase === 'completed') {
    return (
      <Card className="text-center">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="text-6xl">✨</div>
            <div>
              <h3 className="text-xl font-bold">Session terminée !</h3>
              <p className="text-muted-foreground">
                Félicitations pour avoir pris ce moment pour vous
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>Durée :</strong> {selectedDuration} minute{selectedDuration > 1 ? 's' : ''}
              </p>
              <p className="text-sm">
                <strong>Type :</strong> {MEDITATION_PROGRAMS.find(p => p.type === selectedProgram)?.title}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={resetSession} className="w-full">
              Nouvelle session
            </Button>
            <p className="text-xs text-muted-foreground">
              Prenez quelques instants pour savourer cette sensation de calme
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
