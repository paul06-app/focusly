'use client';

import { useState } from 'react';
import { MeditationGuide } from '@/components/MeditationGuide';
import { MoodTracker } from '@/components/MoodTracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { isToday, isThisWeek, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EmotionPage() {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState('mood');

  // Statistiques de méditation
  const allMeditationSessions = data.meditationSessions;
  const todayMeditations = allMeditationSessions.filter(session => isToday(session.date));
  const thisWeekMeditations = allMeditationSessions.filter(session => isThisWeek(session.date));
  const completedMeditations = allMeditationSessions.filter(session => session.completed);
  
  const totalMeditationTime = completedMeditations.reduce((total, session) => total + session.duration, 0);
  const averageSessionLength = completedMeditations.length > 0 
    ? Math.round(totalMeditationTime / completedMeditations.length) 
    : 0;

  // Statistiques d'humeur
  const allMoodEntries = data.moodEntries;
  const todayMood = allMoodEntries.find(entry => isToday(entry.date));
  const thisWeekMoods = allMoodEntries.filter(entry => isThisWeek(entry.date));
  
  const getMoodStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasEntry = allMoodEntries.some(entry => 
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

  const getAverageWeeklyMood = () => {
    if (thisWeekMoods.length === 0) return null;
    
    const moodValues = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5,
    };
    
    const total = thisWeekMoods.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    const average = total / thisWeekMoods.length;
    
    if (average >= 4.5) return { level: 'excellent', emoji: '😄', text: 'Excellente' };
    if (average >= 3.5) return { level: 'good', emoji: '😊', text: 'Bonne' };
    if (average >= 2.5) return { level: 'neutral', emoji: '😐', text: 'Neutre' };
    if (average >= 1.5) return { level: 'low', emoji: '😔', text: 'Difficile' };
    return { level: 'very-low', emoji: '😢', text: 'Très difficile' };
  };

  const weeklyMoodAverage = getAverageWeeklyMood();
  const moodStreak = getMoodStreak();

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Bien-être Émotionnel 🧘‍♀️</h1>
        <p className="text-muted-foreground">
          Prenez soin de votre santé mentale
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {todayMeditations.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Méditations aujourd'hui
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {moodStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              Jours de suivi
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(totalMeditationTime / 60)}h{totalMeditationTime % 60}m
            </div>
            <div className="text-xs text-muted-foreground">
              Temps total
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-orange-600">
              {averageSessionLength}min
            </div>
            <div className="text-xs text-muted-foreground">
              Session moyenne
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Résumé de la semaine */}
      {weeklyMoodAverage && (
        <Card className={`${
          weeklyMoodAverage.level === 'excellent' ? 'bg-green-50 dark:bg-green-950' :
          weeklyMoodAverage.level === 'good' ? 'bg-blue-50 dark:bg-blue-950' :
          weeklyMoodAverage.level === 'neutral' ? 'bg-gray-50 dark:bg-gray-950' :
          weeklyMoodAverage.level === 'low' ? 'bg-orange-50 dark:bg-orange-950' :
          'bg-red-50 dark:bg-red-950'
        }`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{weeklyMoodAverage.emoji}</span>
              <div>
                <p className="font-medium">
                  Humeur de la semaine : {weeklyMoodAverage.text}
                </p>
                <p className="text-sm text-muted-foreground">
                  Basé sur {thisWeekMoods.length} entrée{thisWeekMoods.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rappel quotidien */}
      {!todayMood && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💙</span>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">
                  N'oubliez pas de noter votre humeur
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Prenez un moment pour faire le point sur votre journée
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mood">Suivi Humeur</TabsTrigger>
          <TabsTrigger value="meditation">Méditation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood" className="space-y-4 mt-6">
          <MoodTracker />
        </TabsContent>
        
        <TabsContent value="meditation" className="space-y-4 mt-6">
          <MeditationGuide />
        </TabsContent>
      </Tabs>

      {/* Historique récent */}
      {(completedMeditations.length > 0 || allMoodEntries.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Méditations récentes */}
            {completedMeditations
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 3)
              .map((session) => (
                <div key={session.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🧘‍♀️</span>
                    <div>
                      <div className="font-medium text-sm">
                        {session.type === 'breathing' && 'Respiration'}
                        {session.type === 'mindfulness' && 'Pleine conscience'}
                        {session.type === 'body-scan' && 'Scan corporel'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(session.date, 'dd/MM à HH:mm', { locale: fr })}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {session.duration}min
                  </Badge>
                </div>
              ))}

            {/* Entrées d'humeur récentes */}
            {allMoodEntries
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 3)
              .map((entry) => {
                const moodEmojis = {
                  'very-sad': '😢',
                  'sad': '😔',
                  'neutral': '😐',
                  'happy': '😊',
                  'very-happy': '😄',
                };
                
                return (
                  <div key={entry.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{moodEmojis[entry.mood]}</span>
                      <div>
                        <div className="font-medium text-sm">
                          Humeur notée
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(entry.date, 'dd/MM à HH:mm', { locale: fr })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        E:{entry.energy} S:{entry.stress}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      {/* Conseils de bien-être */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="text-lg">💝 Conseils bien-être</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Routine quotidienne</strong> : Notez votre humeur chaque jour</p>
          <p>• <strong>Méditation régulière</strong> : Même 5 minutes font la différence</p>
          <p>• <strong>Bienveillance</strong> : Soyez patient avec vous-même</p>
          <p>• <strong>Soutien</strong> : N'hésitez pas à parler à un proche si besoin</p>
        </CardContent>
      </Card>

      {/* Message d'encouragement */}
      {allMoodEntries.length === 0 && completedMeditations.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🌱 Commencez votre parcours de bien-être dès aujourd'hui
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🌟 Bravo pour prendre soin de votre bien-être mental !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
