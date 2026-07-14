import { useState, useEffect } from 'react';
import { mockUsers } from '../services/mockData';
import type { User } from '../services/mockData';

export type FileType = 'document' | 'image' | 'archive' | 'design';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  modified: string;
  owner: User;
  version: string;
  isDeliverable: boolean;
  projectId?: string;
  objectUrl?: string; // transient for current session
}

const initialMockFiles: FileItem[] = [
  { id: 'f1', name: 'Product_Requirements_v2.pdf', type: 'document', size: '2.4 MB', modified: '2 hours ago', owner: mockUsers.sarah, version: 'v2.1', isDeliverable: true },
  { id: 'f2', name: 'UI_Components_Library.fig', type: 'design', size: '14.2 MB', modified: 'Yesterday', owner: mockUsers.elena, version: 'v4.0', isDeliverable: true },
  { id: 'f3', name: 'API_Documentation.md', type: 'document', size: '45 KB', modified: '3 days ago', owner: mockUsers.rahul, version: 'v1.0', isDeliverable: false },
  { id: 'f4', name: 'Q3_Financial_Projections.xlsx', type: 'document', size: '1.1 MB', modified: 'Last week', owner: mockUsers.marcus, version: 'v1.2', isDeliverable: true },
  { id: 'f5', name: 'Hero_Assets.zip', type: 'archive', size: '42 MB', modified: 'Aug 14', owner: mockUsers.elena, version: 'v1.0', isDeliverable: false },
  { id: 'f6', name: 'Logo_Pack_Final.zip', type: 'archive', size: '8.4 MB', modified: 'Aug 10', owner: mockUsers.priya, version: 'v1.0', isDeliverable: false },
  { id: 'f7', name: 'Meeting_Notes_Aug.docx', type: 'document', size: '120 KB', modified: 'Aug 8', owner: mockUsers.sarah, version: 'v1.0', isDeliverable: false },
];

const STORAGE_KEY = 'orqon_files_v1';

export function useFiles(projectId?: string) {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return initialMockFiles;
      }
    }
    return initialMockFiles;
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockFiles));
    }

    const handleStorage = () => {
      const updated = localStorage.getItem(STORAGE_KEY);
      if (updated) {
        try {
          const parsed = JSON.parse(updated) as FileItem[];
          setFiles(prev => {
            return parsed.map(p => {
              const existing = prev.find(pf => pf.id === p.id);
              return existing?.objectUrl ? { ...p, objectUrl: existing.objectUrl } : p;
            });
          });
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('orqon-files-updated', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('orqon-files-updated', handleStorage);
    };
  }, []);

  const addFile = (file: FileItem) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let current = initialMockFiles;
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {}
    }
    
    const toSave = { ...file };
    delete toSave.objectUrl;

    const updated = [toSave, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    setFiles(prev => [file, ...prev]);
    window.dispatchEvent(new Event('orqon-files-updated'));
  };

  const deleteFile = (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let current = initialMockFiles;
    if (stored) {
      try {
        current = JSON.parse(stored);
      } catch (e) {}
    }
    const updated = current.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    setFiles(prev => prev.filter(f => f.id !== id));
    window.dispatchEvent(new Event('orqon-files-updated'));
  };

  const projectFiles = projectId ? files.filter(f => f.projectId === projectId || f.id.startsWith('f')) : files;

  return { files: projectFiles, addFile, deleteFile };
}
