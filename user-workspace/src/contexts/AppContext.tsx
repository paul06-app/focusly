'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppData, Task, TimerSession, MoodEntry, BrainGameScore, MeditationSession, UserSettings } from '@/types';
import { storage } from '@/lib/storage';
import { notificationManager } from '@/lib/notifications';

interface AppContextType {
  // Données
  data: AppData;
  loading: boolean;
  
  // Actions pour les tâches
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  // Actions pour les sessions de timer
  addTimerSession: (session: Omit<TimerSession, 'id'>) => void;
  updateTimerSession: (id: string, updates: Partial<TimerSession>) => void;
  
  // Actions pour l'humeur
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  
  // Actions pour les jeux cérébraux
  addBrainGameScore: (score: Omit<BrainGameScore, 'id'>) => void;
  
  // Actions pour la méditation
  addMeditationSession: (session: Omit<MeditationSession, 'id'>) => void;
  
  // Actions pour les paramètres
  updateSettings: (updates: Partial<UserSettings>) => void;
  
  // Utilitaires
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [data, setData] = useState<AppData>(storage.getData());
  const [loading, setLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    try {
      const storedData = storage.getData();
      setData(storedData);
      
      // Initialiser les notifications si activées
      if (storedData.settings.notifications.enabled) {
        notificationManager.requestPermission();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder automatiquement les changements
  useEffect(() => {
    if (!loading) {
      storage.setData(data);
    }
  }, [data, loading]);

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Actions pour les tâches
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date(),
      };
      
      setData(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    try {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  const deleteTask = (id: string) => {
    try {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  const toggleTask = (id: string) => {
    try {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        ),
      }));
    } catch (error) {
      console.error('Erreur lors du basculement de la tâche:', error);
    }
  };

  // Actions pour les sessions de timer
  const addTimerSession = (sessionData: Omit<TimerSession, 'id'>) => {
    try {
      const newSession: TimerSession = {
        ...sessionData,
        id: generateId(),
      };
      
      setData(prev => ({
        ...prev,
        timerSessions: [...prev.timerSessions, newSession],
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la session:', error);
    }
  };

  const updateTimerSession = (id: string, updates: Partial<TimerSession>) => {
    try {
      setData(prev => ({
        ...prev,
        timerSessions: prev.timerSessions.map(session => 
          session.id === id ? { ...session, ...updates } : session
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
    }
  };

  // Actions pour l'humeur
  const addMoodEntry = (entryData: Omit<MoodEntry, 'id'>) => {
    try {
      const newEntry: MoodEntry = {
        ...entryData,
        id: generateId(),
      };
      
      setData(prev => ({
        ...prev,
        moodEntries: [...prev.moodEntries, newEntry],
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'entrée d\'humeur:', error);
    }
  };

  const updateMoodEntry = (id: string, updates: Partial<MoodEntry>) => {
    try {
      setData(prev => ({
        ...prev,
        moodEntries: prev.moodEntries.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entrée d\'humeur:', error);
    }
  };

  // Actions pour les jeux cérébraux
  const addBrainGameScore = (scoreData: Omit<BrainGameScore, 'id'>) => {
    try {
      const newScore: BrainGameScore = {
        ...scoreData,
        id: generateId(),
      };
      
      setData(prev => ({
        ...prev,
        brainGameScores: [...prev.brainGameScores, newScore],
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout du score:', error);
    }
  };

  // Actions pour la méditation
  const addMeditationSession = (sessionData: Omit<MeditationSession, 'id'>) => {
    try {
      const newSession: MeditationSession = {
        ...sessionData,
        id: generateId(),
      };
      
      setData(prev => ({
        ...prev,
        meditationSessions: [...prev.meditationSessions, newSession],
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la session de méditation:', error);
    }
  };

  // Actions pour les paramètres
  const updateSettings = (updates: Partial<UserSettings>) => {
    try {
      setData(prev => ({
        ...prev,
        settings: { ...prev.settings, ...updates },
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
    }
  };

  // Utilitaires
  const exportData = (): string => {
    try {
      return storage.exportData();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return '';
    }
  };

  const importData = (jsonData: string): boolean => {
    try {
      const success = storage.importData(jsonData);
      if (success) {
        setData(storage.getData());
      }
      return success;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  };

  const clearAllData = () => {
    try {
      storage.clearData();
      setData(storage.getData());
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  };

  const contextValue: AppContextType = {
    data,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addTimerSession,
    updateTimerSession,
    addMoodEntry,
    updateMoodEntry,
    addBrainGameScore,
    addMeditationSession,
    updateSettings,
    exportData,
    importData,
    clearAllData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp doit être utilisé dans un AppProvider');
  }
  return context;
}
