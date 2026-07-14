import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Plus, Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ProjectCard } from '../../components/ui/ProjectCard';
import { SkeletonProjectCard } from '../../components/ui/Skeleton';
import type { Project } from '../../services/mockData';
import { useProjects } from '../../hooks/useProjects';
import { ProjectModal } from '../../components/project/ProjectModal';
import './ProjectsList.css';

type FilterTab = 'all' | 'active' | 'at-risk' | 'completed' | 'archived';
type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'name' | 'progress';

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'At Risk', value: 'at-risk' },
  { label: 'Completed', value: 'completed' },
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

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  name: 'Name',
  progress: 'Progress',
};

function sortProjects(projects: Project[], sort: SortOption): Project[] {
  const sortedProjects = [...projects];
  if (sort === 'newest') return sortedProjects;
  if (sort === 'oldest') return sortedProjects.reverse();
  if (sort === 'name') return sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
  return sortedProjects.sort((a, b) => b.progress - a.progress);
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const ProjectsList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { projects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate loading state for skeleton demonstration
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery, viewMode]);

  const filteredProjects = sortProjects(
    filterProjects(projects, activeFilter, searchQuery),
    sortOption
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="projects-page">
      
      {/* ── Header ── */}
      <div className="projects-page-header">
        <div>
          <h1 className="projects-page-title">All Projects</h1>
          <p className="projects-page-subtitle">View and manage all your team's projects.</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>New Project</Button>
      </div>

      {/* ── Filters & Controls ── */}
      <div className="projects-controls">
        <nav className="projects-filter-tabs" aria-label="Project filters">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`projects-filter-tab${activeFilter === tab.value ? ' active' : ''}`}
              onClick={() => setActiveFilter(tab.value)}
              aria-current={activeFilter === tab.value ? 'page' : undefined}
            >
              {tab.label}
              <span className="tab-count">
                {filterProjects(projects, tab.value, '').length}
              </span>
            </button>
          ))}
        </nav>

        <div className="projects-actions">
          <div className="projects-search-container">
            <Search size={14} className="projects-search-icon" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search projects…"
              className="projects-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
          </div>
          
          <div className="view-mode-toggle">
            <button 
              className={`view-mode-btn${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              className={`view-mode-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>

          <div className="projects-sort">
            <Button
              variant="ghost"
              rightIcon={<ChevronDown size={14} />}
              onClick={() => setIsSortOpen((isOpen) => !isOpen)}
              aria-expanded={isSortOpen}
              aria-haspopup="menu"
            >
              Sort: {SORT_LABELS[sortOption]}
            </Button>
            {isSortOpen && (
              <div className="projects-sort-menu" role="menu" aria-label="Sort projects">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`projects-sort-option${sortOption === option ? ' active' : ''}`}
                    onClick={() => {
                      setSortOption(option);
                      setIsSortOpen(false);
                    }}
                    role="menuitemradio"
                    aria-checked={sortOption === option}
                  >
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'projects-grid-view' : 'projects-list-view'}>
          <SkeletonProjectCard count={6} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="projects-empty-state">
          <Search size={40} className="empty-icon" />
          <p className="empty-title">No projects found</p>
          <p className="empty-subtitle">We couldn't find any projects matching your search.</p>
          <Button variant="outline" onClick={() => setSearchQuery('')}>Clear search</Button>
        </div>
      ) : (
        <motion.div
          className={viewMode === 'grid' ? 'projects-grid-view' : 'projects-list-view'}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activeFilter + searchQuery + viewMode}
        >
          {viewMode === 'list' && (
            <div className="projects-list-header">
              <div className="plist-h-title">Project</div>
              <div className="plist-h-status">Status</div>
              <div className="plist-h-progress">Progress</div>
              <div className="plist-h-team">Team</div>
              <div className="plist-h-meta">Details</div>
              <div className="plist-h-action"></div>
            </div>
          )}
          
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={cardVariants}>
              <ProjectCard project={project} view={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
};

export default ProjectsList;
