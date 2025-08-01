'use client';

import { Timer } from '@/components/Timer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TimersPage() {
  const { data } = useApp();

  // Filtrer les sessions d'aujourd'hui
  const todaySessions = data.timerSessions.filter(session => 
    isToday(session.startTime)
  );

  const completedSessions = todaySessions.filter(session => session.completed);
  const focusSessions = completedSessions.filter(session => session.type === 'focus');
  const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0);

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'focus': return { label: 'Focus', emoji: '🎯', color: 'bg-blue-500' };
      case 'break': return { label: 'Pause courte', emoji: '☕', color: 'bg-green-500' };
      case 'long-break': return { label: 'Pause longue', emoji: '🌟', color: 'bg-purple-500' };
      default: return { label: 'Session', emoji: '⏱️', color: 'bg-gray-500' };
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Timer & Focus 🎯</h1>
        <p className="text-muted-foreground">
          Gérez votre temps et améliorez votre concentration
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-primary">
              {focusSessions.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Sessions focus
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-primary">
              {Math.floor(totalFocusTime / 60)}h{totalFocusTime % 60}m
            </div>
            <div className="text-xs text-muted-foreground">
              Temps total
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-primary">
              {completedSessions.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Sessions totales
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Composant Timer principal */}
      <Timer />

      {/* Historique des sessions d'aujourd'hui */}
      {todaySessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique du jour</CardTitle>
            <CardDescription>
              Vos sessions d'aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySessions
              .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
              .slice(0, 5)
              .map((session) => {
                const typeInfo = getSessionTypeLabel(session.type);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${typeInfo.color}`}></div>
                      <div>
                        <div className="font-medium text-sm">
                          {typeInfo.emoji} {typeInfo.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(session.startTime, 'HH:mm', { locale: fr })}
                          {session.endTime && ` - ${format(session.endTime, 'HH:mm', { locale: fr })}`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={session.completed ? "default" : "secondary"}>
                        {session.duration}min
                      </Badge>
                      {!session.completed && (
                        <div className="text-xs text-muted-foreground mt-1">
                          En cours
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            
            {todaySessions.length > 5 && (
              <div className="text-center text-sm text-muted-foreground">
                Et {todaySessions.length - 5} session{todaySessions.length - 5 > 1 ? 's' : ''} de plus...
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conseils pour la technique Pomodoro */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="text-lg">💡 Technique Pomodoro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>25 min de focus</strong> : Concentrez-vous sur une seule tâche</p>
          <p>• <strong>5 min de pause</strong> : Détendez-vous, bougez, hydratez-vous</p>
          <p>• <strong>Pause longue</strong> : Toutes les 4 sessions, prenez 15-30 min</p>
          <p>• <strong>Éliminez les distractions</strong> : Téléphone en mode silencieux</p>
        </CardContent>
      </Card>

      {/* Message d'encouragement */}
      {focusSessions.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🚀 Prêt à commencer votre première session de focus ?
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🎉 Excellent travail ! Vous avez déjà complété {focusSessions.length} session{focusSessions.length > 1 ? 's' : ''} de focus aujourd'hui !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
