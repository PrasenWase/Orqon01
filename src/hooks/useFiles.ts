import { useEffect, useState } from 'react';
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
  projectTitle?: string;
  objectUrl?: string;
}

interface UploadContext {
  projectId?: string;
  projectTitle?: string;
  uploadedBy?: User;
}

const STORAGE_KEY = 'orqon_files_v1';

const initialMockFiles: FileItem[] = [
  { id: 'f1', name: 'Product_Requirements_v2.pdf', type: 'document', size: '2.4 MB', modified: '2 hours ago', owner: mockUsers.sarah, version: 'v2.1', isDeliverable: true },
  { id: 'f2', name: 'UI_Components_Library.fig', type: 'design', size: '14.2 MB', modified: 'Yesterday', owner: mockUsers.elena, version: 'v4.0', isDeliverable: true },
  { id: 'f3', name: 'API_Documentation.md', type: 'document', size: '45 KB', modified: '3 days ago', owner: mockUsers.rahul, version: 'v1.0', isDeliverable: false },
  { id: 'f4', name: 'Q3_Financial_Projections.xlsx', type: 'document', size: '1.1 MB', modified: 'Last week', owner: mockUsers.marcus, version: 'v1.2', isDeliverable: true },
  { id: 'f5', name: 'Hero_Assets.zip', type: 'archive', size: '42 MB', modified: 'Aug 14', owner: mockUsers.elena, version: 'v1.0', isDeliverable: false },
  { id: 'f6', name: 'Logo_Pack_Final.zip', type: 'archive', size: '8.4 MB', modified: 'Aug 10', owner: mockUsers.priya, version: 'v1.0', isDeliverable: false },
  { id: 'f7', name: 'Meeting_Notes_Aug.docx', type: 'document', size: '120 KB', modified: 'Aug 8', owner: mockUsers.sarah, version: 'v1.0', isDeliverable: false },
];

function readFiles(): FileItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as FileItem[] : initialMockFiles;
  } catch {
    return initialMockFiles;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)) - 1, units.length - 1);
  return `${(bytes / 1024 ** (index + 1)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function getFileType(file: File): FileType {
  if (file.type.startsWith('image/')) return 'image';
  if (/\.(zip|rar|7z|tar|gz)$/i.test(file.name)) return 'archive';
  if (/\.(fig|sketch|xd)$/i.test(file.name)) return 'design';
  return 'document';
}

export function useFiles(projectId?: string) {
  const [files, setFiles] = useState<FileItem[]>(readFiles);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockFiles));
    }

    const syncFiles = () => {
      const storedFiles = readFiles();
      setFiles((currentFiles) => storedFiles.map((file) => {
        const currentFile = currentFiles.find((item) => item.id === file.id);
        return currentFile?.objectUrl ? { ...file, objectUrl: currentFile.objectUrl } : file;
      }));
    };
    window.addEventListener('storage', syncFiles);
    window.addEventListener('orqon-files-updated', syncFiles);
    return () => {
      window.removeEventListener('storage', syncFiles);
      window.removeEventListener('orqon-files-updated', syncFiles);
    };
  }, []);

  const persistFiles = (updated: FileItem[]) => {
    const persistable = updated.map(({ objectUrl: _objectUrl, ...file }) => file);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    setFiles(updated);
    window.dispatchEvent(new Event('orqon-files-updated'));
  };

  const uploadFiles = (selectedFiles: FileList | File[], context: UploadContext = {}) => {
    const uploadedBy = context.uploadedBy ?? mockUsers.sarah;
    const modified = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const newFiles = Array.from(selectedFiles).map((file): FileItem => ({
      id: `file-${crypto.randomUUID()}`,
      name: file.name,
      type: getFileType(file),
      size: formatFileSize(file.size),
      modified,
      owner: uploadedBy,
      version: 'v1.0',
      isDeliverable: false,
      projectId: context.projectId,
      projectTitle: context.projectTitle,
      objectUrl: URL.createObjectURL(file),
    }));

    if (newFiles.length) persistFiles([...newFiles, ...files]);
  };

  const deleteFile = (id: string) => {
    const file = files.find((item) => item.id === id);
    if (file?.objectUrl) URL.revokeObjectURL(file.objectUrl);
    persistFiles(files.filter((item) => item.id !== id));
  };

  const downloadFile = (file: FileItem) => {
    if (!file.objectUrl) return;
    const link = document.createElement('a');
    link.href = file.objectUrl;
    link.download = file.name;
    link.click();
  };

  const visibleFiles = projectId
    ? files.filter((file) => !file.projectId || file.projectId === projectId)
    : files;

  return { files: visibleFiles, uploadFiles, deleteFile, downloadFile };
}
