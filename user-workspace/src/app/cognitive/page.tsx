'use client';

import { BrainGame } from '@/components/BrainGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { isToday, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CognitivePage() {
  const { data } = useApp();

  // Statistiques des jeux cérébraux
  const allScores = data.brainGameScores;
  const todayScores = allScores.filter(score => isToday(score.date));
  
  const gameTypes = ['memory', 'attention', 'logic', 'speed'] as const;
  const gameLabels = {
    memory: 'Mémoire',
    attention: 'Attention',
    logic: 'Logique',
    speed: 'Vitesse',
  };

  const getGameStats = (gameType: string) => {
    const gameScores = allScores.filter(score => score.gameType === gameType);
    if (gameScores.length === 0) return { best: 0, average: 0, total: 0 };
    
    const scores = gameScores.map(s => s.score);
    const best = Math.max(...scores);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const total = gameScores.length;
    
    return { best, average, total };
  };

  const getTodayProgress = () => {
    const uniqueGamesPlayed = new Set(todayScores.map(score => score.gameType)).size;
    return (uniqueGamesPlayed / gameTypes.length) * 100;
  };

  const getStreakDays = () => {
    // Calculer la série de jours consécutifs avec au moins un jeu joué
    const dates = [...new Set(allScores.map(score => 
      format(score.date, 'yyyy-MM-dd')
    ))].sort().reverse();
    
    let streak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = format(
        new Date(Date.now() - i * 24 * 60 * 60 * 1000), 
        'yyyy-MM-dd'
      );
      
      if (dates[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const totalGamesPlayed = allScores.length;
  const averageScore = allScores.length > 0 
    ? Math.round(allScores.reduce((sum, score) => sum + score.score, 0) / allScores.length)
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Jeux Cérébraux 🧠</h1>
        <p className="text-muted-foreground">
          Stimulez votre intellect et votre attention
        </p>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-primary">
              {todayScores.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Jeux aujourd'hui
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {getStreakDays()}
            </div>
            <div className="text-xs text-muted-foreground">
              Jours consécutifs
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {totalGamesPlayed}
            </div>
            <div className="text-xs text-muted-foreground">
              Total parties
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-purple-600">
              {averageScore}
            </div>
            <div className="text-xs text-muted-foreground">
              Score moyen
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progrès du jour */}
      {getTodayProgress() > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 dark:text-green-200">
              🎯 Progrès du jour
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              {Math.round(getTodayProgress())}% des types de jeux explorés
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Statistiques par type de jeu */}
      {allScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vos performances</CardTitle>
            <CardDescription>
              Statistiques par type de jeu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {gameTypes.map((gameType) => {
              const stats = getGameStats(gameType);
              if (stats.total === 0) return null;
              
              return (
                <div key={gameType} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium text-sm">
                      {gameLabels[gameType]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.total} partie{stats.total > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="default" className="text-xs">
                      Record: {stats.best}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Moy: {stats.average}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Composant principal des jeux */}
      <BrainGame />

      {/* Conseils pour l'entraînement cérébral */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardHeader>
          <CardTitle className="text-lg">💡 Conseils d'entraînement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Régularité</strong> : 10-15 minutes par jour sont plus efficaces qu'une longue session</p>
          <p>• <strong>Variété</strong> : Alternez entre les différents types de jeux</p>
          <p>• <strong>Progression</strong> : Augmentez progressivement la difficulté</p>
          <p>• <strong>Repos</strong> : Prenez des pauses si vous vous sentez fatigué</p>
        </CardContent>
      </Card>

      {/* Historique récent */}
      {todayScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historique d'aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayScores
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 5)
              .map((score) => (
                <div key={score.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div>
                    <div className="font-medium text-sm">
                      {gameLabels[score.gameType as keyof typeof gameLabels]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(score.date, 'HH:mm', { locale: fr })} • {score.duration}s
                    </div>
                  </div>
                  <Badge variant="outline">
                    {score.score}/{score.maxScore}
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Message d'encouragement */}
      {allScores.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🚀 Prêt à stimuler votre cerveau ? Choisissez votre premier défi !
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🧠 Excellent ! Vous avez joué {totalGamesPlayed} partie{totalGamesPlayed > 1 ? 's' : ''} au total !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
