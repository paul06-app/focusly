import { AppData, UserSettings } from '@/types';

const STORAGE_KEY = 'focusly-data';

// Données par défaut
const defaultSettings: UserSettings = {
  theme: 'dark',
  notifications: {
    enabled: true,
    focusReminders: true,
    taskDeadlines: true,
    moodCheckins: true,
  },
  pomodoro: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
  },
};

const defaultAppData: AppData = {
  tasks: [],
  timerSessions: [],
  moodEntries: [],
  brainGameScores: [],
  meditationSessions: [],
  settings: defaultSettings,
  lastSync: new Date(),
};

// Utilitaires pour le localStorage
export const storage = {
  // Récupérer toutes les données
  getData(): AppData {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultAppData;
      }
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return defaultAppData;
      
      const parsed = JSON.parse(stored);
      
      // Convertir les dates string en objets Date
      return {
        ...parsed,
        tasks: parsed.tasks?.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        })) || [],
        timerSessions: parsed.timerSessions?.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
        })) || [],
        moodEntries: parsed.moodEntries?.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date),
        })) || [],
        brainGameScores: parsed.brainGameScores?.map((score: any) => ({
          ...score,
          date: new Date(score.date),
        })) || [],
        meditationSessions: parsed.meditationSessions?.map((session: any) => ({
          ...session,
          date: new Date(session.date),
        })) || [],
        lastSync: new Date(parsed.lastSync || new Date()),
        settings: { ...defaultSettings, ...parsed.settings },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return defaultAppData;
    }
  },

  // Sauvegarder toutes les données
  setData(data: AppData): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      
      const dataToStore = {
        ...data,
        lastSync: new Date(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  },

  // Sauvegarder partiellement
  updateData(updates: Partial<AppData>): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      const currentData = this.getData();
      const newData = { ...currentData, ...updates };
      this.setData(newData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
    }
  },

  // Effacer toutes les données
  clearData(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  },

  // Exporter les données
  exportData(): string {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return JSON.stringify(defaultAppData, null, 2);
      }
      const data = this.getData();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error);
      return '';
    }
  },

  // Importer les données
  importData(jsonData: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const data = JSON.parse(jsonData);
      this.setData(data);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      return false;
    }
  },
};

// Hook personnalisé pour utiliser le storage
export function useLocalStorage() {
  return storage;
}
