'use client';

import { AnalyticsChart } from '@/components/AnalyticsChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { isThisWeek } from 'date-fns';

export default function AnalyticsPage() {
  const { data } = useApp();

  // Calculs des statistiques générales
  const completedTasks = data.tasks.filter(task => task.completed).length;
  const totalFocusTime = data.timerSessions
    .filter(session => session.completed && session.type === 'focus')
    .reduce((total, session) => total + session.duration, 0);
  const totalMeditationTime = data.meditationSessions
    .filter(session => session.completed)
    .reduce((total, session) => total + session.duration, 0);
  const totalBrainGames = data.brainGameScores.length;
  const moodEntries = data.moodEntries.length;

  // Statistiques de cette semaine
  const thisWeekTasks = data.tasks.filter(task => isThisWeek(task.createdAt));
  const thisWeekCompletedTasks = thisWeekTasks.filter(task => task.completed);
  const thisWeekFocusTime = data.timerSessions
    .filter(session => isThisWeek(session.startTime) && session.completed && session.type === 'focus')
    .reduce((total, session) => total + session.duration, 0);
  const thisWeekMeditation = data.meditationSessions
    .filter(session => isThisWeek(session.date) && session.completed)
    .reduce((total, session) => total + session.duration, 0);
  const thisWeekBrainGames = data.brainGameScores.filter(score => isThisWeek(score.date)).length;

  // Calcul des streaks (séries)
  const getMoodStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasEntry = data.moodEntries.some(entry => 
        entry.date.toDateString() === checkDate.toDateString()
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getFocusStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasFocusSession = data.timerSessions.some(session => 
        session.startTime.toDateString() === checkDate.toDateString() &&
        session.completed &&
        session.type === 'focus'
      );
      
      if (hasFocusSession) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Calcul des moyennes
  const getAverageMood = () => {
    if (data.moodEntries.length === 0) return 0;
    
    const moodValues = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5,
    };
    
    const total = data.moodEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    return Math.round((total / data.moodEntries.length) * 10) / 10;
  };

  const getAverageStress = () => {
    if (data.moodEntries.length === 0) return 0;
    const total = data.moodEntries.reduce((sum, entry) => sum + entry.stress, 0);
    return Math.round((total / data.moodEntries.length) * 10) / 10;
  };

  const getAverageEnergy = () => {
    if (data.moodEntries.length === 0) return 0;
    const total = data.moodEntries.reduce((sum, entry) => sum + entry.energy, 0);
    return Math.round((total / data.moodEntries.length) * 10) / 10;
  };

  // Calcul des objectifs et progrès
  const getWeeklyGoalProgress = () => {
    const goals = {
      focusTime: 150, // 2h30 par semaine
      meditation: 35, // 35 minutes par semaine
      tasks: 10, // 10 tâches par semaine
      brainGames: 5, // 5 jeux par semaine
    };

    return {
      focus: Math.min(100, Math.round((thisWeekFocusTime / goals.focusTime) * 100)),
      meditation: Math.min(100, Math.round((thisWeekMeditation / goals.meditation) * 100)),
      tasks: Math.min(100, Math.round((thisWeekCompletedTasks.length / goals.tasks) * 100)),
      brainGames: Math.min(100, Math.round((thisWeekBrainGames / goals.brainGames) * 100)),
    };
  };

  const weeklyProgress = getWeeklyGoalProgress();
  const moodStreak = getMoodStreak();
  const focusStreak = getFocusStreak();
  const averageMood = getAverageMood();
  const averageStress = getAverageStress();
  const averageEnergy = getAverageEnergy();

  // Calcul du score de bien-être global
  const getWellnessScore = () => {
    let score = 0;
    let factors = 0;

    // Facteur humeur (30%)
    if (averageMood > 0) {
      score += (averageMood / 5) * 30;
      factors++;
    }

    // Facteur stress inversé (20%)
    if (averageStress > 0) {
      score += ((10 - averageStress) / 10) * 20;
      factors++;
    }

    // Facteur énergie (20%)
    if (averageEnergy > 0) {
      score += (averageEnergy / 10) * 20;
      factors++;
    }

    // Facteur régularité (30%)
    const regularityScore = Math.min(30, (moodStreak / 30) * 30);
    score += regularityScore;
    factors++;

    return factors > 0 ? Math.round(score) : 0;
  };

  const wellnessScore = getWellnessScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'À améliorer';
  };

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Analyses & Progrès 📊</h1>
        <p className="text-muted-foreground">
          Suivez votre évolution et vos accomplissements
        </p>
      </div>

      {/* Score de bien-être global */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Score de Bien-être Global</CardTitle>
          <CardDescription>
            Basé sur votre humeur, énergie, stress et régularité
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`text-6xl font-bold ${getScoreColor(wellnessScore)}`}>
            {wellnessScore}%
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {getScoreLabel(wellnessScore)}
          </Badge>
          <Progress value={wellnessScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Statistiques générales */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(totalFocusTime / 60)}h{totalFocusTime % 60}m
            </div>
            <div className="text-xs text-muted-foreground">
              Temps de focus total
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {completedTasks}
            </div>
            <div className="text-xs text-muted-foreground">
              Tâches accomplies
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(totalMeditationTime / 60)}h{totalMeditationTime % 60}m
            </div>
            <div className="text-xs text-muted-foreground">
              Temps de méditation
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-orange-600">
              {totalBrainGames}
            </div>
            <div className="text-xs text-muted-foreground">
              Jeux cérébraux
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs de la semaine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Objectifs de la semaine</CardTitle>
          <CardDescription>
            Votre progression vers les objectifs hebdomadaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>🎯 Focus ({thisWeekFocusTime}min / 150min)</span>
              <span>{weeklyProgress.focus}%</span>
            </div>
            <Progress value={weeklyProgress.focus} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>🧘‍♀️ Méditation ({thisWeekMeditation}min / 35min)</span>
              <span>{weeklyProgress.meditation}%</span>
            </div>
            <Progress value={weeklyProgress.meditation} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>📋 Tâches ({thisWeekCompletedTasks.length} / 10)</span>
              <span>{weeklyProgress.tasks}%</span>
            </div>
            <Progress value={weeklyProgress.tasks} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>🧠 Jeux ({thisWeekBrainGames} / 5)</span>
              <span>{weeklyProgress.brainGames}%</span>
            </div>
            <Progress value={weeklyProgress.brainGames} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Séries et habitudes */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {moodStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              Jours de suivi d&apos;humeur
            </div>
            <div className="text-lg mt-1">🔥</div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {focusStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              Jours de focus consécutifs
            </div>
            <div className="text-lg mt-1">⚡</div>
          </CardContent>
        </Card>
      </div>

      {/* Moyennes personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vos moyennes</CardTitle>
          <CardDescription>
            Basé sur {moodEntries} entrée{moodEntries > 1 ? 's' : ''} d&apos;humeur
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Humeur générale</span>
            <div className="flex items-center gap-2">
              <Progress value={(averageMood / 5) * 100} className="w-20 h-2" />
              <Badge variant="outline">{averageMood}/5</Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Niveau d&apos;énergie</span>
            <div className="flex items-center gap-2">
              <Progress value={(averageEnergy / 10) * 100} className="w-20 h-2" />
              <Badge variant="outline">{averageEnergy}/10</Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Niveau de stress</span>
            <div className="flex items-center gap-2">
              <Progress value={(averageStress / 10) * 100} className="w-20 h-2" />
              <Badge variant="outline">{averageStress}/10</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques détaillés */}
      <AnalyticsChart />

      {/* Insights et recommandations */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="text-lg">💡 Insights personnalisés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {wellnessScore >= 80 && (
            <p>🌟 <strong>Excellent travail !</strong> Vous maintenez un excellent équilibre.</p>
          )}
          {wellnessScore < 80 && wellnessScore >= 60 && (
            <p>👍 <strong>Bon rythme !</strong> Continuez vos efforts, vous êtes sur la bonne voie.</p>
          )}
          {wellnessScore < 60 && (
            <p>💪 <strong>Restez motivé !</strong> Chaque petit pas compte vers votre bien-être.</p>
          )}
          
          {moodStreak >= 7 && (
            <p>🔥 Félicitations pour votre régularité dans le suivi d&apos;humeur !</p>
          )}
          
          {averageStress > 7 && (
            <p>🧘‍♀️ Votre niveau de stress semble élevé. Pensez à plus de méditation.</p>
          )}
          
          {thisWeekFocusTime < 60 && (
            <p>🎯 Essayez d&apos;augmenter votre temps de focus cette semaine.</p>
          )}
        </CardContent>
      </Card>

      {/* Message d'encouragement */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            📈 Chaque jour est une nouvelle opportunité de progresser !
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
