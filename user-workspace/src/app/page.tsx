'use client';

import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { notificationManager } from '@/lib/notifications';

export default function Dashboard() {
  const { data, loading } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Vérifier les permissions de notification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationManager.requestPermission();
    if (granted) {
      setNotificationPermission('granted');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  // Statistiques du jour
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const todayTasks = data.tasks.filter(task => 
    task.createdAt >= todayStart || (task.dueDate && task.dueDate >= todayStart && task.dueDate < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000))
  );
  
  const completedTasks = todayTasks.filter(task => task.completed);
  const pendingTasks = todayTasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  
  const todaySessions = data.timerSessions.filter(session => 
    session.startTime >= todayStart
  );
  
  const completedSessions = todaySessions.filter(session => session.completed);
  const totalFocusTime = completedSessions.reduce((total, session) => total + session.duration, 0);
  
  const todayMood = data.moodEntries.find(entry => 
    entry.date >= todayStart && entry.date < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000)
  );

  const taskCompletionRate = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'very-happy': return '😄';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'very-sad': return '😢';
      default: return '😐';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      {/* En-tête avec salutation */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Bonjour ! 👋</h1>
        <p className="text-sm text-muted-foreground">
          {formatDate(currentTime)}
        </p>
        <p className="text-lg font-medium">
          {formatTime(currentTime)}
        </p>
      </div>

      {/* Alerte pour les notifications */}
      {notificationPermission !== 'granted' && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-orange-800 dark:text-orange-200">
              Notifications désactivées
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Activez les notifications pour recevoir des rappels utiles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleEnableNotifications}
              size="sm"
              variant="outline"
              className="w-full"
            >
              Activer les notifications
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Résumé du jour */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Résumé du jour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progression des tâches */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tâches complétées</span>
              <span>{completedTasks.length}/{todayTasks.length}</span>
            </div>
            <Progress value={taskCompletionRate} className="h-2" />
          </div>

          {/* Temps de focus */}
          <div className="flex justify-between items-center">
            <span className="text-sm">Temps de focus</span>
            <Badge variant="secondary">
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}min
            </Badge>
          </div>

          {/* Humeur du jour */}
          <div className="flex justify-between items-center">
            <span className="text-sm">Humeur du jour</span>
            {todayMood ? (
              <Badge variant="outline">
                {getMoodEmoji(todayMood.mood)} {todayMood.mood}
              </Badge>
            ) : (
              <Link href="/emotion">
                <Button size="sm" variant="outline">
                  Noter mon humeur
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tâches prioritaires */}
      {highPriorityTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Tâches prioritaires
              <Badge variant="destructive">{highPriorityTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {highPriorityTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span className="text-sm font-medium truncate">{task.title}</span>
                <Badge variant="destructive" className="text-xs">
                  {task.priority}
                </Badge>
              </div>
            ))}
            {highPriorityTasks.length > 3 && (
              <Link href="/tasks">
                <Button variant="outline" size="sm" className="w-full">
                  Voir toutes les tâches ({highPriorityTasks.length - 3} de plus)
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Link href="/timers">
            <Button variant="default" className="w-full h-16 flex flex-col gap-1">
              <span className="text-lg">⏱️</span>
              <span className="text-xs">Démarrer Focus</span>
            </Button>
          </Link>
          
          <Link href="/tasks">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
              <span className="text-lg">📋</span>
              <span className="text-xs">Mes Tâches</span>
            </Button>
          </Link>
          
          <Link href="/cognitive">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
              <span className="text-lg">🧠</span>
              <span className="text-xs">Jeu Cérébral</span>
            </Button>
          </Link>
          
          <Link href="/emotion">
            <Button variant="outline" className="w-full h-16 flex flex-col gap-1">
              <span className="text-lg">🧘‍♀️</span>
              <span className="text-xs">Bien-être</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Message motivationnel */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="pt-6 text-center">
          <p className="text-sm font-medium">
            {completedTasks.length > 0 
              ? `Bravo ! Vous avez déjà accompli ${completedTasks.length} tâche${completedTasks.length > 1 ? 's' : ''} aujourd'hui ! 🎉`
              : "Prêt à commencer une journée productive ? 💪"
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
