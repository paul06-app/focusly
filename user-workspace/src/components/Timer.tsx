'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { notificationManager, notificationScheduler } from '@/lib/notifications';
import { TimerSession } from '@/types';

type TimerType = 'focus' | 'break' | 'long-break';
type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface TimerState {
  minutes: number;
  seconds: number;
  totalSeconds: number;
  initialSeconds: number;
  status: TimerStatus;
  type: TimerType;
  sessionCount: number;
}

const TIMER_PRESETS = {
  focus: { minutes: 25, label: 'Focus', emoji: '🎯' },
  break: { minutes: 5, label: 'Pause courte', emoji: '☕' },
  'long-break': { minutes: 15, label: 'Pause longue', emoji: '🌟' },
};

export function Timer() {
  const { data, addTimerSession, updateTimerSession } = useApp();
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null);
  
  const [timer, setTimer] = useState<TimerState>({
    minutes: data.settings.pomodoro.focusTime,
    seconds: 0,
    totalSeconds: data.settings.pomodoro.focusTime * 60,
    initialSeconds: data.settings.pomodoro.focusTime * 60,
    status: 'idle',
    type: 'focus',
    sessionCount: 0,
  });

  // Effet pour le décompte
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.status === 'running' && timer.totalSeconds > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTotalSeconds = prev.totalSeconds - 1;
          const newMinutes = Math.floor(newTotalSeconds / 60);
          const newSeconds = newTotalSeconds % 60;

          if (newTotalSeconds <= 0) {
            // Session terminée
            handleSessionComplete();
            return {
              ...prev,
              minutes: 0,
              seconds: 0,
              totalSeconds: 0,
              status: 'completed',
            };
          }

          return {
            ...prev,
            minutes: newMinutes,
            seconds: newSeconds,
            totalSeconds: newTotalSeconds,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.status, timer.totalSeconds]);

  const handleSessionComplete = useCallback(async () => {
    try {
      // Mettre à jour la session en cours
      if (currentSession) {
        updateTimerSession(currentSession.id, {
          endTime: new Date(),
          completed: true,
        });
      }

      // Envoyer une notification
      if (timer.type === 'focus') {
        await notificationManager.notifyFocusSessionEnd();
      } else {
        await notificationManager.notifyBreakEnd();
      }

      // Suggérer la prochaine session
      const newSessionCount = timer.type === 'focus' ? timer.sessionCount + 1 : timer.sessionCount;
      const shouldTakeLongBreak = newSessionCount % data.settings.pomodoro.longBreakInterval === 0;
      
      if (timer.type === 'focus') {
        const nextType = shouldTakeLongBreak ? 'long-break' : 'break';
        suggestNextSession(nextType);
      }

      setTimer(prev => ({ ...prev, sessionCount: newSessionCount }));
    } catch (error) {
      console.error('Erreur lors de la finalisation de la session:', error);
    }
  }, [currentSession, timer.type, timer.sessionCount, data.settings.pomodoro.longBreakInterval, updateTimerSession]);

  const suggestNextSession = (type: TimerType) => {
    const preset = TIMER_PRESETS[type];
    const duration = type === 'focus' 
      ? data.settings.pomodoro.focusTime
      : type === 'break' 
        ? data.settings.pomodoro.shortBreak
        : data.settings.pomodoro.longBreak;

    setTimer(prev => ({
      ...prev,
      type,
      minutes: duration,
      seconds: 0,
      totalSeconds: duration * 60,
      initialSeconds: duration * 60,
      status: 'idle',
    }));
  };

  const startTimer = async () => {
    try {
      // Créer une nouvelle session
      const newSession: Omit<TimerSession, 'id'> = {
        type: timer.type,
        duration: Math.floor(timer.initialSeconds / 60),
        startTime: new Date(),
        completed: false,
      };

      addTimerSession(newSession);
      
      // Trouver la session créée (dernière ajoutée)
      const sessions = data.timerSessions;
      const latestSession = sessions[sessions.length - 1];
      setCurrentSession(latestSession);

      setTimer(prev => ({ ...prev, status: 'running' }));

      // Programmer une notification pour la fin
      notificationScheduler.schedule(
        'timer-end',
        timer.totalSeconds * 1000,
        () => handleSessionComplete()
      );
    } catch (error) {
      console.error('Erreur lors du démarrage du timer:', error);
    }
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, status: 'paused' }));
    notificationScheduler.cancel('timer-end');
  };

  const resumeTimer = () => {
    setTimer(prev => ({ ...prev, status: 'running' }));
    
    // Reprogrammer la notification
    notificationScheduler.schedule(
      'timer-end',
      timer.totalSeconds * 1000,
      () => handleSessionComplete()
    );
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: Math.floor(prev.initialSeconds / 60),
      seconds: 0,
      totalSeconds: prev.initialSeconds,
      status: 'idle',
    }));
    
    notificationScheduler.cancel('timer-end');
    setCurrentSession(null);
  };

  const changeTimerType = (newType: TimerType) => {
    if (timer.status === 'running') return;

    let duration: number;
    switch (newType) {
      case 'focus':
        duration = data.settings.pomodoro.focusTime;
        break;
      case 'break':
        duration = data.settings.pomodoro.shortBreak;
        break;
      case 'long-break':
        duration = data.settings.pomodoro.longBreak;
        break;
    }

    setTimer({
      ...timer,
      type: newType,
      minutes: duration,
      seconds: 0,
      totalSeconds: duration * 60,
      initialSeconds: duration * 60,
      status: 'idle',
    });
  };

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (timer.initialSeconds === 0) return 0;
    return ((timer.initialSeconds - timer.totalSeconds) / timer.initialSeconds) * 100;
  };

  const getStatusColor = () => {
    switch (timer.status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (timer.status) {
      case 'running': return 'En cours';
      case 'paused': return 'En pause';
      case 'completed': return 'Terminé';
      default: return 'Prêt';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de type de session */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Type de session</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={timer.type}
            onValueChange={(value: TimerType) => changeTimerType(value)}
            disabled={timer.status === 'running'}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TIMER_PRESETS).map(([key, preset]) => (
                <SelectItem key={key} value={key}>
                  {preset.emoji} {preset.label} ({preset.minutes}min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Timer principal */}
      <Card className="text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{TIMER_PRESETS[timer.type].emoji}</span>
            <CardTitle className="text-xl">{TIMER_PRESETS[timer.type].label}</CardTitle>
          </div>
          <CardDescription>
            <Badge variant="outline" className={`${getStatusColor()} text-white`}>
              {getStatusText()}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Affichage du temps */}
          <div className="text-6xl font-mono font-bold">
            {formatTime(timer.minutes, timer.seconds)}
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <Progress value={getProgressPercentage()} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {Math.floor(getProgressPercentage())}% complété
            </p>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-3">
            {timer.status === 'idle' && (
              <Button onClick={startTimer} size="lg" className="px-8">
                Démarrer
              </Button>
            )}
            
            {timer.status === 'running' && (
              <Button onClick={pauseTimer} variant="outline" size="lg" className="px-8">
                Pause
              </Button>
            )}
            
            {timer.status === 'paused' && (
              <>
                <Button onClick={resumeTimer} size="lg" className="px-6">
                  Reprendre
                </Button>
                <Button onClick={resetTimer} variant="outline" size="lg" className="px-6">
                  Reset
                </Button>
              </>
            )}
            
            {timer.status === 'completed' && (
              <Button onClick={resetTimer} size="lg" className="px-8">
                Nouvelle session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de la journée */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques du jour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Sessions complétées</span>
            <Badge variant="secondary">{timer.sessionCount}</Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Temps total de focus</span>
            <Badge variant="secondary">
              {Math.floor((timer.sessionCount * data.settings.pomodoro.focusTime) / 60)}h{' '}
              {(timer.sessionCount * data.settings.pomodoro.focusTime) % 60}min
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Prochaine pause longue</span>
            <Badge variant="outline">
              Dans {data.settings.pomodoro.longBreakInterval - (timer.sessionCount % data.settings.pomodoro.longBreakInterval)} sessions
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Conseils */}
      {timer.status === 'idle' && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              💡 {timer.type === 'focus' 
                ? "Éliminez les distractions et concentrez-vous sur une seule tâche."
                : "Profitez de cette pause pour vous détendre et recharger vos batteries."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
