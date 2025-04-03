'use client';

import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon, TrashIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

type TaskPriority = 'high' | 'medium' | 'low';
type TaskStatus = 'completed' | 'in-progress' | 'todo';

interface Task {
  id: string;
  title: string;
  due: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Q3 campaign performance',
      due: '2023-10-15',
      priority: 'high',
      status: 'todo',
      assignedTo: 'Jane'
    },
    {
      id: '2',
      title: 'Update social media content calendar',
      due: '2023-10-10',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Jane'
    },
    {
      id: '3',
      title: 'Finalize holiday season promotion strategy',
      due: '2023-10-22',
      priority: 'high',
      status: 'todo'
    },
    {
      id: '4',
      title: 'Competitor analysis report',
      due: '2023-10-05',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Jane'
    },
    {
      id: '5',
      title: 'Revise ad copy for Back to School campaign',
      due: '2023-10-12',
      priority: 'low',
      status: 'todo'
    }
  ]);

  const [newTask, setNewTask] = useState<string>('');
  const [viewFilter, setViewFilter] = useState<'all' | 'mine' | 'completed'>('all');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === 'completed' ? 'todo' : 'completed'
        };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Math.random().toString(36).substring(2, 9),
        title: newTask,
        due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        priority: 'medium',
        status: 'todo',
        assignedTo: 'Jane'
      };
      setTasks([newTaskObj, ...tasks]);
      setNewTask('');
      setShowNewTaskInput(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (viewFilter === 'mine') return task.assignedTo === 'Jane';
    if (viewFilter === 'completed') return task.status === 'completed';
    return true;
  });

  const getPriorityStyles = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDueDate = (dateString: string) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format date for display
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const formattedDate = dueDate.toLocaleDateString('en-US', options);
    
    // Add relative time indicator
    if (diffDays < 0) {
      return `${formattedDate} (Overdue)`;
    } else if (diffDays === 0) {
      return `${formattedDate} (Today)`;
    } else if (diffDays === 1) {
      return `${formattedDate} (Tomorrow)`;
    }
    
    return formattedDate;
  };

  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-text-dark flex items-center">
            My Tasks
            <span className="ml-2 text-xs font-medium text-text-muted bg-gray-100 rounded-full px-2 py-0.5">
              {completedTasksCount}/{totalTasks}
            </span>
          </h2>
          <div className="mt-1 flex items-center">
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  completionPercentage >= 75 ? 'bg-green-500' : 
                  completionPercentage >= 50 ? 'bg-blue-500' : 
                  completionPercentage >= 25 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs text-text-muted">{completionPercentage}%</span>
          </div>
        </div>
        <div className="flex">
          <button 
            onClick={() => setShowNewTaskInput(true)}
            className="text-white bg-primary hover:bg-primary-dark rounded-lg p-1.5 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-3 flex space-x-1 text-xs">
        <button 
          onClick={() => setViewFilter('all')} 
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            viewFilter === 'all' 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'hover:bg-gray-100 text-text-muted'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setViewFilter('mine')} 
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            viewFilter === 'mine' 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'hover:bg-gray-100 text-text-muted'
          }`}
        >
          Mine
        </button>
        <button 
          onClick={() => setViewFilter('completed')} 
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            viewFilter === 'completed' 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'hover:bg-gray-100 text-text-muted'
          }`}
        >
          Completed
        </button>
      </div>
      
      {showNewTaskInput && (
        <form onSubmit={addTask} className="mb-2 flex items-center p-2 border border-primary/20 bg-primary/5 rounded-lg">
          <CheckCircleIcon className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-text-dark placeholder:text-gray-400"
            autoFocus
          />
          <div className="flex space-x-1">
            <button 
              type="button" 
              onClick={() => setShowNewTaskInput(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
            <button 
              type="submit" 
              disabled={!newTask.trim()}
              className="p-1 text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
            >
              <SparklesIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto pb-1 space-y-1.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-4 text-text-muted">
            <p className="text-xs">No tasks match your filter.</p>
            {viewFilter !== 'all' && (
              <button 
                onClick={() => setViewFilter('all')}
                className="text-primary text-xs font-medium hover:underline mt-1"
              >
                View all tasks
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              className={`group flex items-start p-2 rounded-lg transition-all ${
                task.status === 'completed' 
                  ? 'bg-gray-50 opacity-75' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <button 
                onClick={() => toggleTaskStatus(task.id)}
                className="mt-0.5 mr-2 focus:outline-none transition-colors"
              >
                {task.status === 'completed' ? (
                  <CheckCircleIconSolid className="w-4 h-4 text-green-500" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-medium ${
                  task.status === 'completed' ? 'text-text-muted line-through' : 'text-text-dark'
                }`}>
                  {task.title}
                </h4>
                <div className="flex items-center mt-0.5 text-[10px] space-x-1.5">
                  <span className={`px-1.5 py-0.5 rounded-full ${getPriorityStyles(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-text-muted flex items-center">
                    <ClockIcon className="w-3 h-3 mr-0.5" />
                    {formatDueDate(task.due)}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="ml-1 p-0.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all focus:opacity-100"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 