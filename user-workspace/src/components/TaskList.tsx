'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Task, SubTask } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
  };
}

export function TaskList() {
  const { data, addTask, updateTask, deleteTask, toggleTask } = useApp();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high-priority'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'due' | 'priority'>('created');

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        completed: false,
        subtasks: [],
      };

      if (editingTask) {
        updateTask(editingTask.id, taskData);
        setEditingTask(null);
      } else {
        addTask(taskData);
      }

      resetForm();
      setIsAddingTask(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la tâche:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
    });
    setEditingTask(task);
    setIsAddingTask(true);
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(taskId);
    }
  };

  const addSubTask = (taskId: string, subTaskTitle: string) => {
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: subTaskTitle,
      completed: false,
    };

    const updatedSubTasks = [...(task.subtasks || []), newSubTask];
    updateTask(taskId, { subtasks: updatedSubTasks });
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    const task = data.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return;

    const updatedSubTasks = task.subtasks.map(st =>
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );

    updateTask(taskId, { subtasks: updatedSubTasks });
  };

  // Filtrer et trier les tâches
  const filteredTasks = data.tasks.filter(task => {
    switch (filter) {
      case 'pending': return !task.completed;
      case 'completed': return task.completed;
      case 'high-priority': return task.priority === 'high' && !task.completed;
      default: return true;
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'due':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Moyenne';
    }
  };

  const isOverdue = (task: Task) => {
    return task.dueDate && task.dueDate < new Date() && !task.completed;
  };

  const getCompletionPercentage = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.completed ? 100 : 0;
    }
    
    const completedSubTasks = task.subtasks.filter(st => st.completed).length;
    const mainTaskWeight = 0.3; // La tâche principale compte pour 30%
    const subTasksWeight = 0.7; // Les sous-tâches comptent pour 70%
    
    const mainTaskProgress = task.completed ? mainTaskWeight : 0;
    const subTasksProgress = (completedSubTasks / task.subtasks.length) * subTasksWeight;
    
    return Math.round((mainTaskProgress + subTasksProgress) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="flex flex-col gap-4">
        {/* Bouton d'ajout */}
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button className="w-full" onClick={() => {
              resetForm();
              setEditingTask(null);
            }}>
              ➕ Ajouter une tâche
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
              </DialogTitle>
              <DialogDescription>
                {editingTask ? 'Modifiez les détails de votre tâche' : 'Créez une nouvelle tâche à accomplir'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de la tâche"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée (optionnel)"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Basse</SelectItem>
                      <SelectItem value="medium">🟡 Moyenne</SelectItem>
                      <SelectItem value="high">🔴 Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dueDate">Échéance</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingTask ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingTask(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Filtres et tri */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les tâches</SelectItem>
              <SelectItem value="pending">En cours</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="high-priority">Priorité haute</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Par date de création</SelectItem>
              <SelectItem value="due">Par échéance</SelectItem>
              <SelectItem value="priority">Par priorité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "Aucune tâche pour le moment. Ajoutez-en une !" 
                  : "Aucune tâche ne correspond à ce filtre."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onEdit={() => handleEdit(task)}
              onDelete={() => handleDelete(task.id)}
              onAddSubTask={(title) => addSubTask(task.id, title)}
              onToggleSubTask={(subTaskId) => toggleSubTask(task.id, subTaskId)}
              isOverdue={isOverdue(task)}
              completionPercentage={getCompletionPercentage(task)}
              getPriorityColor={getPriorityColor}
              getPriorityLabel={getPriorityLabel}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Composant pour une tâche individuelle
interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddSubTask: (title: string) => void;
  onToggleSubTask: (subTaskId: string) => void;
  isOverdue: boolean;
  completionPercentage: number;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
}

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onAddSubTask,
  onToggleSubTask,
  isOverdue,
  completionPercentage,
  getPriorityColor,
  getPriorityLabel,
}: TaskCardProps) {
  const [showSubTasks, setShowSubTasks] = useState(false);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubTaskTitle.trim()) {
      onAddSubTask(newSubTaskTitle.trim());
      setNewSubTaskTitle('');
    }
  };

  return (
    <Card className={`${task.completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-500' : ''}`}>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {/* En-tête de la tâche */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggle()}
              className="mt-1"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline">
                  {getPriorityLabel(task.priority)}
                </Badge>
                
                {task.dueDate && (
                  <Badge variant={isOverdue ? "destructive" : "secondary"}>
                    {format(task.dueDate, 'dd/MM/yyyy', { locale: fr })}
                  </Badge>
                )}
                
                {completionPercentage > 0 && completionPercentage < 100 && (
                  <Badge variant="outline">
                    {completionPercentage}% complété
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={onEdit}>
                ✏️
              </Button>
              <Button size="sm" variant="ghost" onClick={onDelete}>
                🗑️
              </Button>
            </div>
          </div>

          {/* Sous-tâches */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="ml-6 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubTasks(!showSubTasks)}
                className="text-xs p-1 h-auto"
              >
                {showSubTasks ? '▼' : '▶'} {task.subtasks.length} sous-tâche{task.subtasks.length > 1 ? 's' : ''}
              </Button>
              
              {showSubTasks && (
                <div className="space-y-2">
                  {task.subtasks.map((subTask) => (
                      <Checkbox
                        checked={subTask.completed}
                        onCheckedChange={() => onToggleSubTask(subTask.id)}
                        className="scale-75"
                      />
                      <span className={`text-sm ${subTask.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subTask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ajouter une sous-tâche */}
          {showSubTasks && (
            <form onSubmit={handleAddSubTask} className="ml-6 flex gap-2">
              <Input
                value={newSubTaskTitle}
                onChange={(e) => setNewSubTaskTitle(e.target.value)}
                placeholder="Ajouter une sous-tâche..."
                className="text-sm h-8"
              />
              <Button type="submit" size="sm" className="h-8">
                +
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
