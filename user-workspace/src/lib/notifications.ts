// Utilitaires pour les notifications navigateur
export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.permission = Notification.permission;
    }
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  // Demander la permission pour les notifications
  async requestPermission(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.warn('Les notifications ne sont pas supportées par ce navigateur');
        return false;
      }

      if (this.permission === 'granted') {
        return true;
      }

      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      return permission === 'granted';
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  // Vérifier si les notifications sont autorisées
  isPermissionGranted(): boolean {
    return this.permission === 'granted';
  }

  // Envoyer une notification
  async sendNotification(title: string, options?: NotificationOptions): Promise<boolean> {
    try {
      if (!this.isPermissionGranted()) {
        const granted = await this.requestPermission();
        if (!granted) {
          return false;
        }
      }

      const defaultOptions: NotificationOptions = {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'focusly',
        requireInteraction: false,
        ...options,
      };

      new Notification(title, defaultOptions);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return false;
    }
  }

  // Notifications spécifiques à l'application
  async notifyFocusSessionEnd(): Promise<void> {
    await this.sendNotification('Session de focus terminée ! 🎯', {
      body: 'Prenez une pause bien méritée.',
      tag: 'focus-end',
    });
  }

  async notifyBreakEnd(): Promise<void> {
    await this.sendNotification('Pause terminée ! ⏰', {
      body: 'Prêt pour une nouvelle session de focus ?',
      tag: 'break-end',
    });
  }

  async notifyTaskDeadline(taskTitle: string): Promise<void> {
    await this.sendNotification('Échéance de tâche ! 📋', {
      body: `La tâche "${taskTitle}" arrive à échéance.`,
      tag: 'task-deadline',
    });
  }

  async notifyMoodCheckIn(): Promise<void> {
    await this.sendNotification('Comment vous sentez-vous ? 😊', {
      body: 'Prenez un moment pour noter votre humeur.',
      tag: 'mood-checkin',
    });
  }

  async notifyDailyChallenge(): Promise<void> {
    await this.sendNotification('Défi quotidien disponible ! 🧠', {
      body: 'Un nouveau jeu cérébral vous attend.',
      tag: 'daily-challenge',
    });
  }

  async notifyMeditationReminder(): Promise<void> {
    await this.sendNotification('Moment de méditation 🧘‍♀️', {
      body: 'Accordez-vous quelques minutes de détente.',
      tag: 'meditation-reminder',
    });
  }
}

// Instance globale
export const notificationManager = NotificationManager.getInstance();

// Utilitaires pour programmer des notifications
export class NotificationScheduler {
  private timers: Map<string, NodeJS.Timeout> = new Map();

  // Programmer une notification
  schedule(id: string, delay: number, callback: () => void): void {
    try {
      // Annuler le timer existant s'il y en a un
      this.cancel(id);

      const timer = setTimeout(() => {
        callback();
        this.timers.delete(id);
      }, delay);

      this.timers.set(id, timer);
    } catch (error) {
      console.error('Erreur lors de la programmation de la notification:', error);
    }
  }

  // Annuler une notification programmée
  cancel(id: string): void {
    try {
      const timer = this.timers.get(id);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(id);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la notification:', error);
    }
  }

  // Annuler toutes les notifications
  cancelAll(): void {
    try {
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers.clear();
    } catch (error) {
      console.error('Erreur lors de l\'annulation de toutes les notifications:', error);
    }
  }

  // Programmer des rappels récurrents
  scheduleRecurring(id: string, interval: number, callback: () => void): void {
    try {
      this.cancel(id);

      const timer = setInterval(callback, interval);
      this.timers.set(id, timer as any);
    } catch (error) {
      console.error('Erreur lors de la programmation récurrente:', error);
    }
  }
}

export const notificationScheduler = new NotificationScheduler();
