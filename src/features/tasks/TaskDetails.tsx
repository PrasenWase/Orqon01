import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Paperclip,
  Sparkles,
  AlertTriangle,
  FileText,
  Send
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Skeleton } from '../../components/ui/Skeleton';

import { 
  mockUsers,
  type TaskStatus
} from '../../services/mockData';
import { useTasks } from '../../hooks/useTasks';

import './TaskDetails.css';

// ---- Local Mock Extensions for Task Details ----
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface Comment {
  id: string;
  user: typeof mockUsers['sarah'];
  text: string;
  timestamp: string;
}

const mockSubtasks: Record<string, Subtask[]> = {
  't1': [
    { id: 'st1', title: 'Design fingerprint UI for Android', completed: true },
    { id: 'st2', title: 'Design FaceID UI for iOS', completed: true },
    { id: 'st3', title: 'Implement fallback PIN code screen', completed: false },
    { id: 'st4', title: 'Security review with backend team', completed: false },
  ],
};

const mockAttachments: Record<string, Attachment[]> = {
  't1': [
    { id: 'att1', name: 'biometric-flow-v2.fig', size: '4.2 MB', type: 'figma' },
    { id: 'att2', name: 'security-guidelines.pdf', size: '1.1 MB', type: 'pdf' },
  ],
};

const mockComments: Record<string, Comment[]> = {
  't1': [
    { id: 'c1', user: mockUsers.elena, text: 'The FaceID animations are looking good, but we need to ensure they match the iOS native feel. Can we review this tomorrow?', timestamp: '2 hours ago' },
    { id: 'c2', user: mockUsers.rahul, text: 'Sure, I have updated the spring physics. Take a look at the latest build.', timestamp: '1 hour ago' },
  ],
};

const mockAiSuggestions: Record<string, { text: string; action: string; isWarning?: boolean }[]> = {
  't1': [
    { text: 'This task is part of the critical path. Delaying it will push the project deadline by 2 days.', action: 'View Timeline', isWarning: true },
    { text: 'Elena recently worked on similar biometric flows in the Zenith App.', action: 'Ask Elena for review' }
  ]
};

// ---- Helpers ----
function statusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    'to-do': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'done': 'Done',
  };
  return map[status];
}

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  
  const { tasks } = useTasks();
  const task = tasks.find((t) => t.id === taskId);
  const subtasks = task ? (mockSubtasks[task.id] || []) : [];
  const attachments = task ? (mockAttachments[task.id] || []) : [];
  const comments = task ? (mockComments[task.id] || []) : [];
  const aiSuggestions = task ? (mockAiSuggestions[task.id] || []) : [];

  const [localSubtasks, setLocalSubtasks] = useState<Subtask[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLocalSubtasks(subtasks);
    }, 600);
    return () => clearTimeout(timer);
  }, [taskId, subtasks]);

  const toggleSubtask = (id: string) => {
    setLocalSubtasks(prev => 
      prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st)
    );
  };

  if (!task && !isLoading) {
    return (
      <div className="td-not-found">
        <h2>Task not found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const completedSubtasks = localSubtasks.filter(st => st.completed).length;
  const subtaskProgress = localSubtasks.length > 0 
    ? Math.round((completedSubtasks / localSubtasks.length) * 100) 
    : 0;

  return (
    <motion.div 
      className="task-details-page"
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      {/* ── Header ── */}
      <div className="td-header">
        <div className="td-header-left">
          <button onClick={() => navigate(-1)} className="td-back-link">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          
          {isLoading ? (
            <Skeleton width="400px" height="32px" />
          ) : (
            <div className="td-title-wrapper">
              <span className="td-project-ref">{task?.projectTitle}</span>
              <h1 className="td-title">{task?.title}</h1>
            </div>
          )}
        </div>
        
        <div className="td-header-actions">
          {isLoading ? (
            <Skeleton width="120px" height="36px" />
          ) : (
            <>
              <span className={`td-status-badge status-${task?.status}`}>
                {statusLabel(task!.status)}
              </span>
              <Button variant="outline">Edit</Button>
              <Button variant="ghost" className="td-more-btn" aria-label="More options">
                <MoreHorizontal size={18} />
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="td-skeleton-layout">
          <div className="td-grid">
            <div className="td-main-col">
              <Skeleton height="200px" />
              <Skeleton height="300px" />
              <Skeleton height="250px" />
            </div>
            <div className="td-side-col">
              <Skeleton height="300px" />
              <Skeleton height="200px" />
            </div>
          </div>
        </div>
      ) : (
        <div className="td-grid">
          {/* ── Main Column ── */}
          <div className="td-main-col">
            
            {/* Description */}
            <Card className="td-card">
              <h2 className="td-section-title">Description</h2>
              <div className="td-description">
                {task?.description || 'No description provided.'}
              </div>
            </Card>

            {/* Subtasks */}
            <Card className="td-card">
              <div className="td-card-header">
                <h2 className="td-section-title">Subtasks</h2>
                {localSubtasks.length > 0 && (
                  <span className="td-subtask-progress">{subtaskProgress}% Complete</span>
                )}
              </div>
              
              {localSubtasks.length === 0 ? (
                <div className="td-empty">No subtasks added.</div>
              ) : (
                <div className="td-subtasks-list">
                  {/* Progress bar */}
                  <div className="td-progress-track">
                    <div className="td-progress-fill" style={{ width: `${subtaskProgress}%` }} />
                  </div>
                  
                  {localSubtasks.map(st => (
                    <div 
                      key={st.id} 
                      className={`td-subtask-item ${st.completed ? 'completed' : ''}`}
                      onClick={() => toggleSubtask(st.id)}
                    >
                      <button className="td-checkbox">
                        {st.completed ? (
                          <CheckCircle2 size={18} className="td-checkbox-icon checked" />
                        ) : (
                          <Circle size={18} className="td-checkbox-icon" />
                        )}
                      </button>
                      <span className="td-subtask-title">{st.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Comments */}
            <Card className="td-card">
              <div className="td-card-header">
                <h2 className="td-section-title">Comments</h2>
                <Badge variant="default">{comments.length}</Badge>
              </div>

              <div className="td-comments-list">
                {comments.length === 0 ? (
                  <div className="td-empty">No comments yet.</div>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="td-comment-item">
                      <Avatar 
                        src={comment.user.avatarUrl} 
                        alt={comment.user.name} 
                        fallback={comment.user.initials} 
                      />
                      <div className="td-comment-content">
                        <div className="td-comment-header">
                          <span className="td-comment-author">{comment.user.name}</span>
                          <span className="td-comment-time">{comment.timestamp}</span>
                        </div>
                        <div className="td-comment-text">{comment.text}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="td-comment-input-box">
                <Avatar 
                  src={mockUsers.sarah.avatarUrl} 
                  alt="Current user" 
                  fallback="SC" 
                />
                <div className="td-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="td-comment-input"
                  />
                  <button className="td-comment-send" disabled={!commentText.trim()}>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Side Column ── */}
          <div className="td-side-col">
            
            {/* Meta details */}
            <Card className="td-card td-meta-card">
              <div className="td-meta-row">
                <div className="td-meta-label">Assignee</div>
                <div className="td-meta-value">
                  <Avatar 
                    src={task?.assignee.avatarUrl} 
                    alt={task?.assignee.name} 
                    fallback={task?.assignee.initials} 
                    size="sm" 
                  />
                  <span>{task?.assignee.name}</span>
                </div>
              </div>
              
              <div className="td-meta-row">
                <div className="td-meta-label">Due Date</div>
                <div className="td-meta-value">
                  <Calendar size={14} className="td-meta-icon" />
                  <span>{task?.deadline}</span>
                </div>
              </div>
              
              <div className="td-meta-row">
                <div className="td-meta-label">Priority</div>
                <div className="td-meta-value">
                  <span className={`td-priority-badge priority-${task?.priority}`}>
                    {task?.priority}
                  </span>
                </div>
              </div>
              
              <div className="td-meta-row">
                <div className="td-meta-label">Time Logged</div>
                <div className="td-meta-value">
                  <Clock size={14} className="td-meta-icon" />
                  <span>4h 30m</span>
                </div>
              </div>
            </Card>

            {/* AI Suggestions Panel */}
            {aiSuggestions.length > 0 && (
              <Card className="td-card td-ai-card">
                <div className="td-ai-header">
                  <Sparkles size={16} className="td-ai-logo" />
                  <span>Orqon AI Suggestions</span>
                </div>
                <div className="td-ai-list">
                  {aiSuggestions.map((sugg, i) => (
                    <div key={i} className={`td-ai-item ${sugg.isWarning ? 'warning' : ''}`}>
                      {sugg.isWarning && <AlertTriangle size={14} className="td-ai-warn-icon" />}
                      <div className="td-ai-content">
                        <p>{sugg.text}</p>
                        <button className="td-ai-action">{sugg.action}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Attachments */}
            <Card className="td-card">
              <div className="td-card-header">
                <h2 className="td-section-title">Attachments</h2>
                <Button variant="ghost" size="sm" leftIcon={<Paperclip size={14} />}>Add</Button>
              </div>
              
              {attachments.length === 0 ? (
                <div className="td-empty">No attachments.</div>
              ) : (
                <div className="td-attachments-list">
                  {attachments.map(att => (
                    <div key={att.id} className="td-attachment-item">
                      <div className="td-attachment-icon">
                        <FileText size={16} />
                      </div>
                      <div className="td-attachment-info">
                        <span className="td-attachment-name">{att.name}</span>
                        <span className="td-attachment-size">{att.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskDetails;
