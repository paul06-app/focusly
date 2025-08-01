// Types pour l'application Focusly
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  subtasks?: SubTask[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TimerSession {
  id: string;
  type: 'focus' | 'break' | 'long-break';
  duration: number; // en minutes
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

export interface MoodEntry {
  id: string;
  date: Date;
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
  notes?: string;
  energy: number; // 1-10
  stress: number; // 1-10
}

export interface BrainGameScore {
  id: string;
  gameType: 'memory' | 'attention' | 'logic' | 'speed';
  score: number;
  maxScore: number;
  date: Date;
  duration: number; // en secondes
}

export interface MeditationSession {
  id: string;
  type: 'breathing' | 'mindfulness' | 'body-scan';
  duration: number; // en minutes
  date: Date;
  completed: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    enabled: boolean;
    focusReminders: boolean;
    taskDeadlines: boolean;
    moodCheckins: boolean;
  };
  pomodoro: {
    focusTime: number; // en minutes
    shortBreak: number;
    longBreak: number;
    longBreakInterval: number;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export interface AppData {
  tasks: Task[];
  timerSessions: TimerSession[];
  moodEntries: MoodEntry[];
  brainGameScores: BrainGameScore[];
  meditationSessions: MeditationSession[];
  settings: UserSettings;
  lastSync: Date;
}
