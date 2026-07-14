import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Search, ChevronDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { AvatarGroup, Avatar } from '../../components/ui/Avatar';
import { mockActivity } from '../../services/mockData';
import type { Project } from '../../services/mockData';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { ProjectModal } from '../../components/project/ProjectModal';
import { TaskModal } from '../../components/task/TaskModal';
import './Dashboard.css';

type FilterTab = 'all' | 'active' | 'at-risk' | 'completed' | 'archived';

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'At Risk', value: 'at-risk' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
];

function filterProjects(projects: Project[], filter: FilterTab, query: string): Project[] {
  const q = query.toLowerCase();
  return projects.filter((p) => {
    const matchesQuery =
      q === '' || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    if (!matchesQuery) return false;
    if (filter === 'all') return true;
    if (filter === 'active') return p.status === 'healthy' || p.status === 'at-risk';
    if (filter === 'at-risk') return p.status === 'at-risk' || p.status === 'delayed';
    if (filter === 'completed') return p.status === 'completed';
    return false;
  });
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { projects } = useProjects();
  const { tasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const filteredProjects = filterProjects(projects, activeFilter, searchQuery);
  const atRiskCount = projects.filter((p) => p.status === 'at-risk' || p.status === 'delayed').length;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* ── Page Header ── */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">Projects</h1>
          <p className="dashboard-page-subtitle">Manage and monitor every project from one place.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} aria-label="Create new project" onClick={() => setIsModalOpen(true)}>
          New Project
        </Button>
      </div>
      
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      {/* ── AI Banner ── */}
      <div className="ai-banner" role="region" aria-label="AI Insights">
        <div className="ai-banner-content">
          <Sparkles size={22} className="ai-banner-icon" aria-hidden="true" />
          <div>
            <div className="ai-banner-title">
              Orqon AI <Badge variant="ai">INSIGHTS ACTIVE</Badge>
            </div>
            <p className="ai-banner-text">
              {atRiskCount} project{atRiskCount !== 1 ? 's' : ''} need attention today. 1 project is at risk of
              missing its deadline. 2 overdue tasks require reassignment.
            </p>
          </div>
        </div>
        <Button variant="secondary" rightIcon={<ChevronDown size={14} />}>
          Review AI Actions
        </Button>
      </div>

      {/* ── Filters ── */}
      <div className="dashboard-filters">
        <nav className="filter-tabs" aria-label="Project filters">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`filter-tab${activeFilter === tab.value ? ' active' : ''}`}
              onClick={() => setActiveFilter(tab.value)}
              aria-current={activeFilter === tab.value ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="filter-actions">
          <div className="filter-search-container">
            <Search size={14} className="filter-search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search projects…"
              className="filter-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          <Button variant="ghost" rightIcon={<ChevronDown size={14} />} aria-label="Sort options">
            Sort: Newest
          </Button>
        </div>
      </div>

      {/* ── Projects Grid ── */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={40} className="empty-icon" />
          <p className="empty-title">No projects found</p>
          <p className="empty-subtitle">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activeFilter + searchQuery}
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={cardVariants} className="project-card-wrapper">
              <Card hoverable className="project-card">
                {/* Card Header */}
                <div className="project-card-header">
                  <h2 className="project-card-title">{project.title}</h2>
                  <Badge variant={project.status === 'delayed' ? 'delayed' : project.status === 'completed' ? 'healthy' : project.status}>
                    {project.status === 'at-risk'
                      ? 'At Risk'
                      : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>

                <p className="project-card-desc">{project.description}</p>

                {/* Progress */}
                <div className="project-card-progress">
                  <Progress
                    value={project.progress}
                    variant={project.status as 'healthy' | 'at-risk' | 'delayed' | 'completed'}
                    showLabel
                  />
                </div>

                {/* Team + Stats */}
                <div className="project-card-meta">
                  <AvatarGroup max={3}>
                    {project.team.map((member) => (
                      <Avatar
                        key={member.id}
                        src={member.avatarUrl}
                        alt={member.name}
                        fallback={member.initials}
                      />
                    ))}
                  </AvatarGroup>
                  <div className="project-card-stats">
                    <span className="stat-tasks">{project.openTasks} open tasks</span>
                    <span className="stat-deadline">Due {project.deadline}</span>
                  </div>
                </div>

                {/* AI Recommendation */}
                {project.aiRecommendation && (
                  <div
                    className={`project-ai-rec${project.aiRecommendation.isBlocker ? ' ai-rec-blocker' : ''}`}
                    role="note"
                    aria-label="AI Recommendation"
                  >
                    <div className="ai-rec-header">
                      {project.aiRecommendation.isBlocker ? (
                        <AlertTriangle size={11} aria-hidden="true" />
                      ) : (
                        <Sparkles size={11} aria-hidden="true" />
                      )}
                      {project.aiRecommendation.isBlocker ? 'BLOCKER DETECTED' : 'AI RECOMMENDATION'}
                    </div>
                    <p className="ai-rec-text">{project.aiRecommendation.text}</p>
                    <a href="#" className="ai-rec-action">
                      {project.aiRecommendation.actionLabel} <ArrowRight size={11} />
                    </a>
                  </div>
                )}

                {/* CTA */}
                <div className="project-card-footer">
                  <Link to={`/projects/${project.id}`} className="project-open-link" tabIndex={-1}>
                    <Button variant="outline" fullWidth>
                      Open Project
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Bottom Panels: Recent Tasks + Activity ── */}
      <div className="dashboard-bottom-panels">
        {/* Recent Tasks */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Tasks</h2>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Button size="sm" variant="ghost" onClick={() => setIsTaskModalOpen(true)}>New Task</Button>
              <Link to="/projects" className="panel-see-all">See all</Link>
            </div>
          </div>
          <ul className="task-list">
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id} className="task-item">
                <div className={`task-priority-bar priority-${task.priority}`} aria-label={`Priority: ${task.priority}`} />
                <div className="task-body">
                  <span className="task-title">{task.title}</span>
                  <span className="task-project">{task.projectTitle}</span>
                </div>
                <div className="task-right">
                  <span className={`task-status-pill status-${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className="task-deadline">{task.deadline}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Activity Feed */}
        <div className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Team Activity</h2>
            <span className="panel-live">● Live</span>
          </div>
          <ul className="activity-list">
            {mockActivity.map((item) => (
              <li key={item.id} className="activity-item">
                <Avatar
                  src={item.user.avatarUrl}
                  alt={item.user.name}
                  fallback={item.user.initials}
                  size="sm"
                />
                <div className="activity-body">
                  <span className="activity-text">
                    <strong>{item.user.name}</strong> {item.action}{' '}
                    <span className="activity-target">{item.target}</span>
                  </span>
                  <span className="activity-meta">
                    {item.projectTitle} · {item.timestamp}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
