import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { mockUsers } from '../../services/mockData';
import type { User, Project } from '../../services/mockData';
import { useProjects } from '../../hooks/useProjects';
import './ProjectModal.css';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const { addProject } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('healthy'); // healthy, at-risk, delayed, completed
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project Name is required');
      return;
    }

    const newProject: Project = {
      id: `p_${Date.now()}`,
      title,
      description,
      status: status as any,
      progress: 0,
      openTasks: 0,
      deadline: deadline || new Date().toISOString().split('T')[0],
      team: selectedUsers.map(id => Object.values(mockUsers).find(u => u.id === id) as User).filter(Boolean),
    };

    addProject(newProject);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus('healthy');
    setPriority('medium');
    setDeadline('');
    setSelectedUsers([]);
    setError('');
    
    onClose();
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content project-modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="modal-header">
              <h2>New Project</h2>
              <button className="modal-close" onClick={onClose}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <Input
                label="Project Name *"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                error={error}
                placeholder="e.g. Website Redesign"
                autoFocus
              />
              
              <div className="input-wrapper">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field textarea-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="input-wrapper">
                  <label className="input-label">Status</label>
                  <select className="input-field select-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="healthy">Planning</option>
                    <option value="at-risk">In Progress</option>
                    <option value="delayed">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="input-wrapper">
                  <label className="input-label">Priority</label>
                  <select className="input-field select-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <Input
                type="date"
                label="Due Date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />

              <div className="input-wrapper">
                <label className="input-label">Team Members</label>
                <div className="team-members-select">
                  {Object.values(mockUsers).map(user => (
                    <button
                      key={user.id}
                      type="button"
                      className={`member-chip ${selectedUsers.includes(user.id) ? 'selected' : ''}`}
                      onClick={() => toggleUser(user.id)}
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button variant="primary" type="submit">Create Project</Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
