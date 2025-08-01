'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

type ChartType = 'mood' | 'focus' | 'tasks' | 'brain-games' | 'meditation';
type TimeRange = '7d' | '30d' | '90d';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function AnalyticsChart() {
  const { data } = useApp();
  const [selectedChart, setSelectedChart] = useState<ChartType>('mood');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const getDateRange = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange();

  // Données pour le graphique d'humeur
  const getMoodData = () => {
    const moodValues = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5,
    };

    const chartData = [];
    for (let i = 0; i < (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90); i++) {
      const date = subDays(endDate, i);
      const dayEntries = data.moodEntries.filter(entry => 
        isWithinInterval(entry.date, { start: startOfDay(date), end: endOfDay(date) })
      );

      if (dayEntries.length > 0) {
        const avgMood = dayEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / dayEntries.length;
        const avgEnergy = dayEntries.reduce((sum, entry) => sum + entry.energy, 0) / dayEntries.length;
        const avgStress = dayEntries.reduce((sum, entry) => sum + entry.stress, 0) / dayEntries.length;

        chartData.unshift({
          date: format(date, 'dd/MM'),
          mood: Math.round(avgMood * 10) / 10,
          energy: Math.round(avgEnergy * 10) / 10,
          stress: Math.round(avgStress * 10) / 10,
        });
      }
    }
    return chartData;
  };

  // Données pour le graphique de focus
  const getFocusData = () => {
    const chartData = [];
    for (let i = 0; i < (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90); i++) {
      const date = subDays(endDate, i);
      const daySessions = data.timerSessions.filter(session => 
        isWithinInterval(session.startTime, { start: startOfDay(date), end: endOfDay(date) }) &&
        session.completed
      );

      const focusSessions = daySessions.filter(s => s.type === 'focus');
      const totalFocusTime = focusSessions.reduce((sum, session) => sum + session.duration, 0);
      const sessionCount = focusSessions.length;

      if (sessionCount > 0 || totalFocusTime > 0) {
        chartData.unshift({
          date: format(date, 'dd/MM'),
          sessions: sessionCount,
          minutes: totalFocusTime,
          avgSession: sessionCount > 0 ? Math.round(totalFocusTime / sessionCount) : 0,
        });
      }
    }
    return chartData;
  };

  // Données pour le graphique des tâches
  const getTasksData = () => {
    const chartData = [];
    for (let i = 0; i < (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90); i++) {
      const date = subDays(endDate, i);
      const dayTasks = data.tasks.filter(task => 
        isWithinInterval(task.createdAt, { start: startOfDay(date), end: endOfDay(date) }) ||
        (task.dueDate && isWithinInterval(task.dueDate, { start: startOfDay(date), end: endOfDay(date) }))
      );

      const completed = dayTasks.filter(task => task.completed).length;
      const created = dayTasks.filter(task => 
        isWithinInterval(task.createdAt, { start: startOfDay(date), end: endOfDay(date) })
      ).length;

      if (completed > 0 || created > 0) {
        chartData.unshift({
          date: format(date, 'dd/MM'),
          completed,
          created,
          completionRate: created > 0 ? Math.round((completed / created) * 100) : 0,
        });
      }
    }
    return chartData;
  };

  // Données pour les jeux cérébraux
  const getBrainGamesData = () => {
    const gameTypes = ['memory', 'attention', 'logic', 'speed'];
    const gameLabels = {
      memory: 'Mémoire',
      attention: 'Attention', 
      logic: 'Logique',
      speed: 'Vitesse',
    };

    return gameTypes.map((type, index) => {
      const gameScores = data.brainGameScores.filter(score => 
        score.gameType === type &&
        isWithinInterval(score.date, { start: startDate, end: endDate })
      );

      const totalGames = gameScores.length;
      const avgScore = totalGames > 0 
        ? Math.round(gameScores.reduce((sum, score) => sum + score.score, 0) / totalGames)
        : 0;

      return {
        name: gameLabels[type as keyof typeof gameLabels],
        games: totalGames,
        avgScore,
        fill: COLORS[index],
      };
    });
  };

  // Données pour la méditation
  const getMeditationData = () => {
    const types = ['breathing', 'mindfulness', 'body-scan'];
    const typeLabels = {
      breathing: 'Respiration',
      mindfulness: 'Pleine conscience',
      'body-scan': 'Scan corporel',
    };

    return types.map((type, index) => {
      const sessions = data.meditationSessions.filter(session => 
        session.type === type &&
        session.completed &&
        isWithinInterval(session.date, { start: startDate, end: endDate })
      );

      const totalSessions = sessions.length;
      const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);

      return {
        name: typeLabels[type as keyof typeof typeLabels],
        sessions: totalSessions,
        minutes: totalTime,
        fill: COLORS[index],
      };
    });
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'mood':
        const moodData = getMoodData();
        if (moodData.length === 0) {
          return (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Aucune donnée d'humeur pour cette période
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 5]} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value,
                  name === 'mood' ? 'Humeur' : name === 'energy' ? 'Énergie' : 'Stress'
                ]}
              />
              <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="energy" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="stress" stroke="#ff7c7c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'focus':
        const focusData = getFocusData();
        if (focusData.length === 0) {
          return (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Aucune session de focus pour cette période
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={focusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value,
                  name === 'sessions' ? 'Sessions' : name === 'minutes' ? 'Minutes' : 'Moy/session'
                ]}
              />
              <Bar dataKey="sessions" fill="#8884d8" />
              <Bar dataKey="minutes" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'tasks':
        const tasksData = getTasksData();
        if (tasksData.length === 0) {
          return (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Aucune activité de tâches pour cette période
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value,
                  name === 'completed' ? 'Terminées' : name === 'created' ? 'Créées' : 'Taux (%)'
                ]}
              />
              <Bar dataKey="completed" fill="#82ca9d" />
              <Bar dataKey="created" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'brain-games':
        const brainGamesData = getBrainGamesData();
        const hasData = brainGamesData.some(item => item.games > 0);
        if (!hasData) {
          return (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Aucun jeu cérébral pour cette période
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={brainGamesData.filter(item => item.games > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, games }) => `${name}: ${games}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="games"
              >
                {brainGamesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Parties jouées']} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'meditation':
        const meditationData = getMeditationData();
        const hasMeditationData = meditationData.some(item => item.sessions > 0);
        if (!hasMeditationData) {
          return (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Aucune session de méditation pour cette période
            </div>
          );
        }
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={meditationData.filter(item => item.sessions > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, minutes }) => `${name}: ${minutes}min`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="minutes"
              >
                {meditationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Minutes']} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (selectedChart) {
      case 'mood': return 'Évolution de l\'humeur';
      case 'focus': return 'Sessions de concentration';
      case 'tasks': return 'Gestion des tâches';
      case 'brain-games': return 'Jeux cérébraux par type';
      case 'meditation': return 'Méditation par type';
      default: return 'Graphique';
    }
  };

  const getChartDescription = () => {
    switch (selectedChart) {
      case 'mood': return 'Humeur, énergie et stress sur la période';
      case 'focus': return 'Nombre de sessions et temps total';
      case 'tasks': return 'Tâches créées vs terminées';
      case 'brain-games': return 'Répartition des parties par type de jeu';
      case 'meditation': return 'Temps de méditation par pratique';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="grid grid-cols-2 gap-3">
        <Select value={selectedChart} onValueChange={(value: ChartType) => setSelectedChart(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mood">📊 Humeur</SelectItem>
            <SelectItem value="focus">🎯 Focus</SelectItem>
            <SelectItem value="tasks">📋 Tâches</SelectItem>
            <SelectItem value="brain-games">🧠 Jeux</SelectItem>
            <SelectItem value="meditation">🧘‍♀️ Méditation</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 jours</SelectItem>
            <SelectItem value="30d">30 jours</SelectItem>
            <SelectItem value="90d">90 jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Graphique principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{getChartTitle()}</CardTitle>
          <CardDescription>{getChartDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Légende pour les graphiques en ligne */}
      {selectedChart === 'mood' && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8884d8] rounded-full"></div>
                <span className="text-sm">Humeur (1-5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#82ca9d] rounded-full"></div>
                <span className="text-sm">Énergie (1-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#ff7c7c] rounded-full"></div>
                <span className="text-sm">Stress (1-10)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedChart === 'focus' && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8884d8] rounded-full"></div>
                <span className="text-sm">Nombre de sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#82ca9d] rounded-full"></div>
                <span className="text-sm">Minutes totales</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedChart === 'tasks' && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#82ca9d] rounded-full"></div>
                <span className="text-sm">Tâches terminées</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#8884d8] rounded-full"></div>
                <span className="text-sm">Tâches créées</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
