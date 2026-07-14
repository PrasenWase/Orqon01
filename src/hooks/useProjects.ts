import { useState, useEffect } from 'react';
import { mockProjects } from '../services/mockData';
import type { Project } from '../services/mockData';

const STORAGE_KEY = 'orqon_projects_v1';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return mockProjects;
      }
    }
    return mockProjects;
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects));
    }

    const handleStorage = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) {
        try {
          setProjects(JSON.parse(updated));
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('orqon-projects-updated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('orqon-projects-updated', handleStorage);
    };
  }, []);

  const addProject = (project: Project) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let current = mockProjects;
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {
        // use mockProjects
      }
    }
    const updated = [project, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProjects(updated);
    window.dispatchEvent(new Event('orqon-projects-updated'));
  };

  return { projects, addProject };
}
