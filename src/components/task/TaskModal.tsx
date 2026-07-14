import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { mockUsers } from '../../services/mockData';
import type { Task } from '../../services/mockData';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import './TaskModal.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
  const { addTask } = useTasks();
  const { projects } = useProjects();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('to-do');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task Title is required');
      return;
    }
    if (!projectId) {
      setError('Project is required');
      return;
    }

    const selectedProject = projects.find(p => p.id === projectId);
    const selectedAssignee = Object.values(mockUsers).find(u => u.id === assigneeId) || Object.values(mockUsers)[0];

    const newTask: Task = {
      id: `t_${Date.now()}`,
      title,
      description,
      status: status as any,
      priority: priority as any,
      projectId,
      projectTitle: selectedProject?.title || 'Unknown Project',
      deadline: deadline || new Date().toISOString().split('T')[0],
      assignee: selectedAssignee,
    };

    addTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setProjectId('');
    setStatus('to-do');
    setPriority('medium');
    setDeadline('');
    setAssigneeId('');
    setError('');
    
    onClose();
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
            className="modal-content task-modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="modal-header">
              <h2>New Task</h2>
              <button className="modal-close" onClick={onClose} type="button"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="modal-error">{error}</div>}
              <Input
                label="Task Title *"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                placeholder="What needs to be done?"
                autoFocus
              />
              
              <div className="input-wrapper">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field textarea-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task details..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="input-wrapper">
                  <label className="input-label">Project *</label>
                  <select className="input-field select-field" value={projectId} onChange={(e) => { setProjectId(e.target.value); setError(''); }}>
                    <option value="" disabled>Select Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="input-wrapper">
                  <label className="input-label">Assignee</label>
                  <select className="input-field select-field" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                    <option value="" disabled>Select Assignee</option>
                    {Object.values(mockUsers).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="input-wrapper">
                  <label className="input-label">Status</label>
                  <select className="input-field select-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="to-do">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Completed</option>
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

              <div className="modal-actions">
                <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
                <Button variant="primary" type="submit">Create Task</Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
