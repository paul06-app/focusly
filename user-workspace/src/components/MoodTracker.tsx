'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/contexts/AppContext';
import { MoodEntry } from '@/types';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

type MoodType = 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';

interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { value: 'very-sad', emoji: '😢', label: 'Très triste', color: 'bg-red-500' },
  { value: 'sad', emoji: '😔', label: 'Triste', color: 'bg-orange-500' },
  { value: 'neutral', emoji: '😐', label: 'Neutre', color: 'bg-gray-500' },
  { value: 'happy', emoji: '😊', label: 'Heureux', color: 'bg-green-500' },
  { value: 'very-happy', emoji: '😄', label: 'Très heureux', color: 'bg-blue-500' },
];

const MOOD_SUGGESTIONS = {
  'very-sad': [
    'Prenez contact avec un proche de confiance',
    'Essayez une courte méditation de 5 minutes',
    'Sortez prendre l\'air quelques minutes',
    'Écoutez de la musique apaisante',
  ],
  'sad': [
    'Pratiquez la gratitude : notez 3 choses positives',
    'Faites une activité créative qui vous plaît',
    'Prenez un bain chaud ou une douche relaxante',
    'Regardez quelque chose qui vous fait sourire',
  ],
  'neutral': [
    'Essayez une nouvelle activité aujourd\'hui',
    'Contactez un ami que vous n\'avez pas vu récemment',
    'Faites une promenade dans la nature',
    'Écoutez un podcast inspirant',
  ],
  'happy': [
    'Partagez votre bonne humeur avec quelqu\'un',
    'Profitez-en pour faire une activité que vous aimez',
    'Notez ce qui vous rend heureux aujourd\'hui',
    'Planifiez quelque chose d\'agréable pour demain',
  ],
  'very-happy': [
    'Célébrez ce moment de bonheur !',
    'Partagez votre joie avec vos proches',
    'Créez un souvenir de ce moment positif',
    'Utilisez cette énergie pour un projet qui vous tient à cœur',
  ],
};

export function MoodTracker() {
  const { data, addMoodEntry, updateMoodEntry } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [energy, setEnergy] = useState<number[]>([5]);
  const [stress, setStress] = useState<number[]>([5]);
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Vérifier s'il y a déjà une entrée aujourd'hui
  const todayEntry = data.moodEntries.find(entry => isToday(entry.date));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMood) return;

    try {
      const moodData: Omit<MoodEntry, 'id'> = {
        date: new Date(),
        mood: selectedMood,
        energy: energy[0],
        stress: stress[0],
        notes: notes.trim() || undefined,
      };

      if (todayEntry) {
        // Mettre à jour l'entrée existante
        updateMoodEntry(todayEntry.id, moodData);
      } else {
        // Créer une nouvelle entrée
        addMoodEntry(moodData);
      }

      // Reset du formulaire
      setSelectedMood(null);
      setEnergy([5]);
      setStress([5]);
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'humeur:', error);
    }
  };

  const getMoodOption = (mood: MoodType) => {
    return MOOD_OPTIONS.find(option => option.value === mood);
  };

  const getWeeklyMoodTrend = () => {
    const lastWeek = data.moodEntries
      .filter(entry => {
        const daysDiff = Math.floor((Date.now() - entry.date.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (lastWeek.length < 2) return null;

    const moodValues = {
      'very-sad': 1,
      'sad': 2,
      'neutral': 3,
      'happy': 4,
      'very-happy': 5,
    };

    const firstMood = moodValues[lastWeek[0].mood];
    const lastMood = moodValues[lastWeek[lastWeek.length - 1].mood];
    
    if (lastMood > firstMood) return 'improving';
    if (lastMood < firstMood) return 'declining';
    return 'stable';
  };

  const getAverageEnergy = () => {
    if (data.moodEntries.length === 0) return 0;
    const total = data.moodEntries.reduce((sum, entry) => sum + entry.energy, 0);
    return Math.round(total / data.moodEntries.length);
  };

  const getAverageStress = () => {
    if (data.moodEntries.length === 0) return 0;
    const total = data.moodEntries.reduce((sum, entry) => sum + entry.stress, 0);
    return Math.round(total / data.moodEntries.length);
  };

  // Si il y a déjà une entrée aujourd'hui, l'afficher
  if (todayEntry && !showForm) {
    const moodOption = getMoodOption(todayEntry.mood);
    const trend = getWeeklyMoodTrend();

    return (
      <div className="space-y-6">
        {/* Entrée du jour */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Votre humeur d'aujourd'hui</CardTitle>
            <CardDescription>
              {format(todayEntry.date, 'EEEE d MMMM yyyy', { locale: fr })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-6xl">{moodOption?.emoji}</div>
              <h3 className="text-xl font-medium">{moodOption?.label}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {todayEntry.energy}/10
                </div>
                <div className="text-sm text-muted-foreground">Énergie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {todayEntry.stress}/10
                </div>
                <div className="text-sm text-muted-foreground">Stress</div>
              </div>
            </div>

            {todayEntry.notes && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium mb-1">Notes :</p>
                <p className="text-sm text-muted-foreground">{todayEntry.notes}</p>
              </div>
            )}

            <Button 
              onClick={() => setShowForm(true)} 
              variant="outline" 
              className="w-full"
            >
              Modifier mon entrée
            </Button>
          </CardContent>
        </Card>

        {/* Suggestions basées sur l'humeur */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 Suggestions pour vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOOD_SUGGESTIONS[todayEntry.mood].map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tendance de la semaine */}
        {trend && (
          <Card className={`${
            trend === 'improving' ? 'bg-green-50 dark:bg-green-950' :
            trend === 'declining' ? 'bg-red-50 dark:bg-red-950' :
            'bg-blue-50 dark:bg-blue-950'
          }`}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '📊'}
                </span>
                <div>
                  <p className="font-medium">
                    {trend === 'improving' && 'Tendance positive cette semaine !'}
                    {trend === 'declining' && 'Semaine un peu difficile'}
                    {trend === 'stable' && 'Humeur stable cette semaine'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Basé sur vos entrées des 7 derniers jours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Formulaire de saisie
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Comment vous sentez-vous ? 😊</h2>
        <p className="text-sm text-muted-foreground">
          {todayEntry ? 'Modifiez votre entrée du jour' : 'Prenez un moment pour noter votre état'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection de l'humeur */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Votre humeur générale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedMood(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMood === option.value
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-xs font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Niveau d'énergie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Niveau d'énergie</CardTitle>
            <CardDescription>
              Comment vous sentez-vous physiquement et mentalement ?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Très fatigué</span>
                <span className="font-medium">{energy[0]}/10</span>
                <span>Très énergique</span>
              </div>
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Niveau de stress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Niveau de stress</CardTitle>
            <CardDescription>
              À quel point vous sentez-vous stressé ou anxieux ?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Très détendu</span>
                <span className="font-medium">{stress[0]}/10</span>
                <span>Très stressé</span>
              </div>
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes optionnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes (optionnel)</CardTitle>
            <CardDescription>
              Qu'est-ce qui influence votre humeur aujourd'hui ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Décrivez ce que vous ressentez, ce qui s'est passé dans votre journée, vos pensées..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={!selectedMood}
          >
            {todayEntry ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
          {todayEntry && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>

      {/* Statistiques rapides */}
      {data.moodEntries.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {getAverageEnergy()}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  Énergie moyenne
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {getAverageStress()}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  Stress moyen
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
