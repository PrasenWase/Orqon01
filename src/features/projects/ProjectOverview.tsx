import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Sparkles, 
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { Skeleton } from '../../components/ui/Skeleton';

import { 
  mockActivity,
  type ProjectStatus 
} from '../../services/mockData';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { TaskModal } from '../../components/task/TaskModal';
import { ProjectModal } from '../../components/project/ProjectModal';

import './ProjectOverview.css';

// Helpers
function statusLabel(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    healthy: 'On Track',
    'at-risk': 'At Risk',
    delayed: 'Delayed',
    completed: 'Completed',
  };
  return map[status];
}

function badgeVariant(
  status: ProjectStatus
): 'healthy' | 'at-risk' | 'delayed' | 'default' {
  if (status === 'completed') return 'healthy';
  if (status === 'healthy') return 'healthy';
  if (status === 'at-risk') return 'at-risk';
  return 'delayed';
}

async function copyCurrentProjectLink(): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(window.location.href);
      return;
    } catch {
      // Fall back for browsers that deny async clipboard access.
    }
  }

  const textArea = document.createElement('textarea');
  textArea.value = window.location.href;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);
  if (!copied) throw new Error('Unable to copy project link');
}

const ProjectOverview: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const { projects, deleteProject } = useProjects();
  const { tasks } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const project = projects.find((p) => p.id === projectId);
  
  // Filter mock data for this specific project
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const projectActivity = mockActivity.filter(a => a.projectTitle === project?.title);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [projectId]);

  const handleShare = async () => {
    try {
      await copyCurrentProjectLink();
      setShowShareToast(true);
      window.setTimeout(() => setShowShareToast(false), 2500);
    } catch {
      // Clipboard access can be denied by browser settings.
    }
  };

  const handleDelete = () => {
    if (!project) return;
    deleteProject(project.id);
    setIsDeleteConfirmationOpen(false);
    navigate('/projects');
  };

  if (!project && !isLoading) {
    return (
      <div className="po-not-found">
        <h2>Project not found</h2>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="project-overview-page"
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      {/* ── Header ── */}
      <div className="po-header">
        <div className="po-header-left">
          <Link to="/projects" className="po-back-link">
            <ArrowLeft size={16} />
            <span>Projects</span>
          </Link>
          {isLoading ? (
            <Skeleton width="300px" height="32px" />
          ) : (
            <div className="po-title-row">
              <h1 className="po-title">{project?.title}</h1>
              <Badge variant={badgeVariant(project!.status)}>
                {statusLabel(project!.status)}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="po-header-actions">
          <Button variant="outline" onClick={handleShare} disabled={!project}>Share</Button>
          <Button onClick={() => setIsProjectModalOpen(true)} disabled={!project}>Edit Project</Button>
          <div className="po-more-menu-wrap">
            <Button
              variant="ghost"
              className="po-more-btn"
              aria-label="More options"
              aria-expanded={isMoreMenuOpen}
              onClick={() => setIsMoreMenuOpen((isOpen) => !isOpen)}
              disabled={!project}
            >
              <MoreHorizontal size={18} />
            </Button>
            {isMoreMenuOpen && (
              <div className="po-more-menu" role="menu" aria-label="Project actions">
                <button
                  type="button"
                  className="po-more-menu-item danger"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    setIsDeleteConfirmationOpen(true);
                  }}
                  role="menuitem"
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs (Visual only for Milestone 5) ── */}
      <nav className="po-tabs" aria-label="Project sections">
        <button className="po-tab active">Overview</button>
        <button className="po-tab">Tasks</button>
        <button className="po-tab">Board</button>
        <button className="po-tab">Files</button>
        <button className="po-tab">Settings</button>
      </nav>

      {isLoading ? (
        <div className="po-skeleton-layout">
          <Skeleton height="100px" className="po-skeleton-banner" />
          <div className="po-grid">
            <div className="po-main-col">
              <Skeleton height="300px" />
              <Skeleton height="400px" />
            </div>
            <div className="po-side-col">
              <Skeleton height="200px" />
              <Skeleton height="350px" />
            </div>
          </div>
        </div>
      ) : (
        <div className="po-content">
          
          {/* ── AI Banner ── */}
          {project?.aiRecommendation && (
            <div className={`po-ai-banner ${project.aiRecommendation.isBlocker ? 'blocker' : ''}`}>
              <div className="po-ai-icon">
                {project.aiRecommendation.isBlocker ? (
                  <AlertTriangle size={20} />
                ) : (
                  <Sparkles size={20} />
                )}
              </div>
              <div className="po-ai-content">
                <div className="po-ai-title">
                  {project.aiRecommendation.isBlocker ? 'BLOCKER DETECTED' : 'ORQON AI INSIGHT'}
                </div>
                <div className="po-ai-text">{project.aiRecommendation.text}</div>
              </div>
              <Button 
                variant={project.aiRecommendation.isBlocker ? 'primary' : 'secondary'} 
                size="sm"
              >
                {project.aiRecommendation.actionLabel}
              </Button>
            </div>
          )}

          <div className="po-grid">
            {/* ── Main Column ── */}
            <div className="po-main-col">
              
              {/* Description & Progress Card */}
              <Card className="po-card po-summary-card">
                <h2 className="po-section-title">About this project</h2>
                <p className="po-description">{project?.description}</p>
                
                <div className="po-progress-section">
                  <div className="po-progress-header">
                    <span className="po-progress-label">Overall Progress</span>
                    <span className="po-progress-value">{project?.progress}%</span>
                  </div>
                  <Progress 
                    value={project?.progress || 0} 
                    variant={badgeVariant(project!.status)} 
                  />
                </div>
              </Card>

              {/* Tasks List */}
              <Card className="po-card">
                <div className="po-card-header">
                  <h2 className="po-section-title">Recent Tasks</h2>
                  <div className="po-actions-group" style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="ghost" size="sm" onClick={() => setIsTaskModalOpen(true)}>New Task</Button>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                </div>
                
                {projectTasks.length === 0 ? (
                  <div className="po-empty">No tasks found for this project.</div>
                ) : (
                  <ul className="po-task-list">
                    {projectTasks.map(task => (
                      <li key={task.id} className="po-task-item">
                        <div className="po-task-main">
                          <CheckCircle2 size={16} className={`po-task-icon status-${task.status}`} />
                          <div className="po-task-info">
                            <Link to={`/tasks/${task.id}`} className="po-task-title">{task.title}</Link>
                            <div className="po-task-meta">
                              <span className={`po-task-priority priority-${task.priority}`}>
                                {task.priority} priority
                              </span>
                              <span className="po-task-deadline">
                                <Calendar size={12} /> {task.deadline}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="po-task-assignee">
                          <Avatar 
                            src={task.assignee.avatarUrl} 
                            alt={task.assignee.name} 
                            fallback={task.assignee.initials} 
                            size="sm" 
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            {/* ── Side Column ── */}
            <div className="po-side-col">
              
              {/* Key Metrics */}
              <Card className="po-card">
                <h2 className="po-section-title">Project Details</h2>
                <div className="po-details-list">
                  <div className="po-detail-item">
                    <div className="po-detail-icon"><Clock size={16} /></div>
                    <div className="po-detail-text">
                      <div className="po-detail-label">Deadline</div>
                      <div className="po-detail-value">{project?.deadline}</div>
                    </div>
                  </div>
                  <div className="po-detail-item">
                    <div className="po-detail-icon"><CheckCircle2 size={16} /></div>
                    <div className="po-detail-text">
                      <div className="po-detail-label">Open Tasks</div>
                      <div className="po-detail-value">{project?.openTasks} tasks pending</div>
                    </div>
                  </div>
                  <div className="po-detail-item">
                    <div className="po-detail-icon"><Users size={16} /></div>
                    <div className="po-detail-text">
                      <div className="po-detail-label">Team Members</div>
                      <div className="po-team-avatars">
                        <AvatarGroup max={4}>
                          {project?.team.map(member => (
                            <Avatar 
                              key={member.id}
                              src={member.avatarUrl}
                              alt={member.name}
                              fallback={member.initials}
                              size="sm"
                            />
                          ))}
                        </AvatarGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Activity Feed */}
              <Card className="po-card">
                <h2 className="po-section-title">Project Activity</h2>
                {projectActivity.length === 0 ? (
                  <div className="po-empty">No recent activity.</div>
                ) : (
                  <div className="po-activity-feed">
                    {projectActivity.map(activity => (
                      <div key={activity.id} className="po-activity-item">
                        <Avatar 
                          src={activity.user.avatarUrl}
                          alt={activity.user.name}
                          fallback={activity.user.initials}
                          size="sm"
                        />
                        <div className="po-activity-content">
                          <div className="po-activity-text">
                            <strong>{activity.user.name}</strong> {activity.action} <span>{activity.target}</span>
                          </div>
                          <div className="po-activity-time">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              
            </div>
          </div>
        </div>
      )}
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={project}
      />

      {isDeleteConfirmationOpen && (
        <>
          <div className="modal-overlay" onClick={() => setIsDeleteConfirmationOpen(false)} />
          <Card className="po-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
            <h2 id="delete-project-title">Delete this project?</h2>
            <p>This action cannot be undone.</p>
            <div className="po-delete-actions">
              <Button variant="secondary" onClick={() => setIsDeleteConfirmationOpen(false)}>Cancel</Button>
              <Button onClick={handleDelete}>Delete</Button>
            </div>
          </Card>
        </>
      )}

      {showShareToast && <div className="po-share-toast" role="status">Project link copied.</div>}
    </motion.div>
  );
};

export default ProjectOverview;
