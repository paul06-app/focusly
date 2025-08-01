'use client';

import { TaskList } from '@/components/TaskList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { isToday, isThisWeek, isPast } from 'date-fns';

export default function TasksPage() {
  const { data } = useApp();

  // Statistiques des tâches
  const allTasks = data.tasks;
  const completedTasks = allTasks.filter(task => task.completed);
  const pendingTasks = allTasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  
  const todayTasks = allTasks.filter(task => 
    (task.dueDate && isToday(task.dueDate)) || 
    (task.createdAt && isToday(task.createdAt))
  );
  
  const thisWeekTasks = allTasks.filter(task => 
    task.dueDate && isThisWeek(task.dueDate)
  );
  
  const overdueTasks = pendingTasks.filter(task => 
    task.dueDate && isPast(task.dueDate)
  );

  const completionRate = allTasks.length > 0 
    ? Math.round((completedTasks.length / allTasks.length) * 100) 
    : 0;

  return (
    <div className="container mx-auto p-4 max-w-md space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Mes Tâches 📋</h1>
        <p className="text-muted-foreground">
          Organisez et suivez vos objectifs
        </p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-primary">
              {pendingTasks.length}
            </div>
            <div className="text-xs text-muted-foreground">
              En cours
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-green-600">
              {completedTasks.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Terminées
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-red-600">
              {highPriorityTasks.length}
            </div>
            <div className="text-xs text-muted-foreground">
              Priorité haute
            </div>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold text-blue-600">
              {completionRate}%
            </div>
            <div className="text-xs text-muted-foreground">
              Taux de réussite
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes importantes */}
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
              ⚠️ Tâches en retard
              <Badge variant="destructive">{overdueTasks.length}</Badge>
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {overdueTasks.length === 1 
                ? "Une tâche a dépassé son échéance"
                : `${overdueTasks.length} tâches ont dépassé leur échéance`
              }
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Résumé de la semaine */}
      {thisWeekTasks.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 dark:text-blue-200">
              📅 Cette semaine
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              {thisWeekTasks.length} tâche{thisWeekTasks.length > 1 ? 's' : ''} à échéance cette semaine
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Composant principal de gestion des tâches */}
      <TaskList />

      {/* Conseils de productivité */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <CardHeader>
          <CardTitle className="text-lg">💡 Conseils de productivité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Priorisez</strong> : Commencez par les tâches importantes et urgentes</p>
          <p>• <strong>Découpez</strong> : Divisez les grandes tâches en sous-tâches</p>
          <p>• <strong>Planifiez</strong> : Définissez des échéances réalistes</p>
          <p>• <strong>Célébrez</strong> : Reconnaissez vos accomplissements</p>
        </CardContent>
      </Card>

      {/* Message d'encouragement */}
      {completedTasks.length === 0 ? (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🚀 Prêt à accomplir vos premiers objectifs ?
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🎉 Bravo ! Vous avez déjà accompli {completedTasks.length} tâche{completedTasks.length > 1 ? 's' : ''} !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
