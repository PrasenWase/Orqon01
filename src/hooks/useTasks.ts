import { useState, useEffect } from 'react';
import { mockTasks } from '../services/mockData';
import type { Task } from '../services/mockData';

const STORAGE_KEY = 'orqon_tasks_v1';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return mockTasks;
      }
    }
    return mockTasks;
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
    }

    const handleStorage = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) {
        try {
          setTasks(JSON.parse(updated));
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('orqon-tasks-updated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('orqon-tasks-updated', handleStorage);
    };
  }, []);

  const addTask = (task: Task) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let current = mockTasks;
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {
        // use mockTasks
      }
    }
    const updated = [task, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setTasks(updated);
    window.dispatchEvent(new Event('orqon-tasks-updated'));
  };

  return { tasks, addTask };
}
