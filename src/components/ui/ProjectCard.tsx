/* ==============================================
   ProjectCard — Reusable card used by both
   Dashboard (grid) and Projects page.
   ============================================== */
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, AlertTriangle, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Badge } from './Badge';
import { Progress } from './Progress';
import { Avatar, AvatarGroup } from './Avatar';
import { Button } from './Button';
import type { Project, ProjectStatus } from '../../services/mockData';
import './ProjectCard.css';

// ---- helpers ----
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

// ---- component ----
interface ProjectCardProps {
  project: Project;
  /** 'grid' is default card view; 'list' renders a compact row */
  view?: 'grid' | 'list';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  view = 'grid',
}) => {
  if (view === 'list') {
    return (
      <motion.div
        className="project-list-row"
        whileHover={{ backgroundColor: 'var(--color-bg-elevated)' }}
        transition={{ duration: 0.15 }}
      >
        <div className="plist-title-col">
          <Link to={`/projects/${project.id}`} className="plist-title">
            {project.title}
          </Link>
          <span className="plist-desc">{project.description}</span>
        </div>

        <div className="plist-status-col">
          <Badge variant={badgeVariant(project.status)}>
            {statusLabel(project.status)}
          </Badge>
        </div>

        <div className="plist-progress-col">
          <Progress
            value={project.progress}
            variant={project.status as 'healthy' | 'at-risk' | 'delayed' | 'completed'}
          />
          <span className="plist-progress-label">{project.progress}%</span>
        </div>

        <div className="plist-team-col">
          <AvatarGroup max={3}>
            {project.team.map((m) => (
              <Avatar
                key={m.id}
                src={m.avatarUrl}
                alt={m.name}
                fallback={m.initials}
                size="sm"
              />
            ))}
          </AvatarGroup>
        </div>

        <div className="plist-meta-col">
          <span className="plist-tasks">{project.openTasks} tasks</span>
          <span className="plist-deadline">Due {project.deadline}</span>
        </div>

        <div className="plist-action-col">
          <Link to={`/projects/${project.id}`} tabIndex={-1}>
            <Button variant="ghost" size="sm">
              Open <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // grid view
  return (
    <Card hoverable className="project-card">
      {/* Header */}
      <div className="pc-header">
        <h2 className="pc-title">{project.title}</h2>
        <Badge variant={badgeVariant(project.status)}>
          {statusLabel(project.status)}
        </Badge>
      </div>

      <p className="pc-desc">{project.description}</p>

      {/* Progress */}
      <div className="pc-progress">
        <Progress
          value={project.progress}
          variant={project.status as 'healthy' | 'at-risk' | 'delayed' | 'completed'}
          showLabel
        />
      </div>

      {/* Team + stats */}
      <div className="pc-meta">
        <AvatarGroup max={3}>
          {project.team.map((m) => (
            <Avatar
              key={m.id}
              src={m.avatarUrl}
              alt={m.name}
              fallback={m.initials}
            />
          ))}
        </AvatarGroup>
        <div className="pc-stats">
          <span className="pc-stat-tasks">
            <Users size={12} aria-hidden="true" />
            {project.team.length} members
          </span>
          <span className="pc-stat-open">{project.openTasks} open tasks</span>
          <span className="pc-stat-deadline">Due {project.deadline}</span>
        </div>
      </div>

      {/* AI Recommendation */}
      {project.aiRecommendation && (
        <div
          className={`pc-ai-rec${project.aiRecommendation.isBlocker ? ' pc-ai-blocker' : ''}`}
          role="note"
          aria-label="AI Recommendation"
        >
          <span className="pc-ai-label">
            {project.aiRecommendation.isBlocker ? (
              <AlertTriangle size={11} aria-hidden="true" />
            ) : (
              <Sparkles size={11} aria-hidden="true" />
            )}
            {project.aiRecommendation.isBlocker ? 'BLOCKER' : 'AI INSIGHT'}
          </span>
          <p className="pc-ai-text">{project.aiRecommendation.text}</p>
          <a href="#" className="pc-ai-action">
            {project.aiRecommendation.actionLabel}
            <ArrowRight size={11} aria-hidden="true" />
          </a>
        </div>
      )}

      {/* CTA */}
      <div className="pc-footer">
        <Link to={`/projects/${project.id}`} className="pc-open-link" tabIndex={-1}>
          <Button variant="outline" fullWidth>
            Open Project
          </Button>
        </Link>
      </div>
    </Card>
  );
};
