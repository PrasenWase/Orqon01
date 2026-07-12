import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { 
  ArrowLeft,
  Search,
  Filter,
  LayoutGrid,
  List,
  UploadCloud,
  FileText,
  FileImage,
  FileArchive,
  FileBox,
  MoreVertical,
  Download,
  FolderOpen,
  Sparkles,
  AlertTriangle,
  Folder
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Progress } from '../../components/ui/Progress';

import { mockProjects, mockUsers } from '../../services/mockData';
import './FilesAndDeliverables.css';

// ---- Local Mock Data ----
type FileType = 'document' | 'image' | 'archive' | 'design';
type ViewMode = 'grid' | 'list';

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  modified: string;
  owner: typeof mockUsers['sarah'];
  version: string;
  isDeliverable: boolean;
}

const mockFiles: FileItem[] = [
  { id: 'f1', name: 'Product_Requirements_v2.pdf', type: 'document', size: '2.4 MB', modified: '2 hours ago', owner: mockUsers.sarah, version: 'v2.1', isDeliverable: true },
  { id: 'f2', name: 'UI_Components_Library.fig', type: 'design', size: '14.2 MB', modified: 'Yesterday', owner: mockUsers.elena, version: 'v4.0', isDeliverable: true },
  { id: 'f3', name: 'API_Documentation.md', type: 'document', size: '45 KB', modified: '3 days ago', owner: mockUsers.rahul, version: 'v1.0', isDeliverable: false },
  { id: 'f4', name: 'Q3_Financial_Projections.xlsx', type: 'document', size: '1.1 MB', modified: 'Last week', owner: mockUsers.marcus, version: 'v1.2', isDeliverable: true },
  { id: 'f5', name: 'Hero_Assets.zip', type: 'archive', size: '42 MB', modified: 'Aug 14', owner: mockUsers.elena, version: 'v1.0', isDeliverable: false },
  { id: 'f6', name: 'Logo_Pack_Final.zip', type: 'archive', size: '8.4 MB', modified: 'Aug 10', owner: mockUsers.priya, version: 'v1.0', isDeliverable: false },
  { id: 'f7', name: 'Meeting_Notes_Aug.docx', type: 'document', size: '120 KB', modified: 'Aug 8', owner: mockUsers.sarah, version: 'v1.0', isDeliverable: false },
];

const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'image': return <FileImage size={24} className="file-icon-svg" />;
    case 'archive': return <FileArchive size={24} className="file-icon-svg" />;
    case 'design': return <FileBox size={24} className="file-icon-svg" />;
    default: return <FileText size={24} className="file-icon-svg" />;
  }
};

const getFileColorClass = (type: FileType) => {
  switch (type) {
    case 'image': return 'file-type-img';
    case 'archive': return 'file-type-arc';
    case 'design': return 'file-type-dsg';
    default: return 'file-type-doc';
  }
};

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

const FilesAndDeliverables: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = mockProjects.find(p => p.id === projectId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFolder, setActiveFolder] = useState('all');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [projectId]);

  // Filtering
  const filteredFiles = mockFiles.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFolder === 'deliverables') return f.isDeliverable;
    if (activeFolder === 'documents') return f.type === 'document';
    if (activeFolder === 'design') return f.type === 'design';
    
    return true;
  });

  const recentUploads = mockFiles.slice(0, 3);
  const deliverables = mockFiles.filter(f => f.isDeliverable);

  return (
    <motion.div 
      className="files-page"
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      {/* ── Page Header ── */}
      <div className="files-header">
        <div className="files-header-left">
          <Link to={`/projects/${projectId}`} className="files-back-link">
            <ArrowLeft size={16} />
            <span>Back to Project</span>
          </Link>
          <div className="files-title-row">
            <h1 className="files-page-title">Files & Deliverables</h1>
            <Badge variant="default">{project?.title || 'Unknown Project'}</Badge>
          </div>
        </div>
        <div className="files-header-actions">
          <Button variant="outline" leftIcon={<FolderOpen size={16} />}>New Folder</Button>
          <Button leftIcon={<UploadCloud size={16} />}>Upload File</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="files-skeleton-layout">
          <div className="fs-grid">
            <div className="fs-main">
              <Skeleton height="60px" className="mb-4" />
              <div className="fs-card-grid">
                <Skeleton height="160px" />
                <Skeleton height="160px" />
                <Skeleton height="160px" />
                <Skeleton height="160px" />
              </div>
            </div>
            <div className="fs-side">
              <Skeleton height="200px" className="mb-4" />
              <Skeleton height="300px" />
            </div>
          </div>
        </div>
      ) : (
        <div className="files-layout">
          
          {/* ── Main Content Area ── */}
          <div className="files-main">
            
            {/* Controls Row */}
            <div className="files-controls">
              <nav className="files-folders" aria-label="Folder navigation">
                <button 
                  className={`folder-tab ${activeFolder === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFolder('all')}
                >
                  <Folder size={14} /> All Files
                </button>
                <button 
                  className={`folder-tab ${activeFolder === 'deliverables' ? 'active' : ''}`}
                  onClick={() => setActiveFolder('deliverables')}
                >
                  <Sparkles size={14} /> Deliverables
                </button>
                <button 
                  className={`folder-tab ${activeFolder === 'documents' ? 'active' : ''}`}
                  onClick={() => setActiveFolder('documents')}
                >
                  <FileText size={14} /> Documents
                </button>
                <button 
                  className={`folder-tab ${activeFolder === 'design' ? 'active' : ''}`}
                  onClick={() => setActiveFolder('design')}
                >
                  <FileBox size={14} /> Design
                </button>
              </nav>

              <div className="files-actions">
                <div className="files-search-container">
                  <Search size={14} className="files-search-icon" />
                  <input
                    type="search"
                    placeholder="Search files…"
                    className="files-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="files-view-toggle">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
                
                <Button variant="ghost" leftIcon={<Filter size={14} />}>Filter</Button>
              </div>
            </div>

            {/* Current Folder Title */}
            <div className="files-current-folder">
              <h2 className="files-folder-name">
                {activeFolder === 'all' ? 'All Files' : 
                 activeFolder === 'deliverables' ? 'Deliverables' :
                 activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}
              </h2>
              <span className="files-count">{filteredFiles.length} files</span>
            </div>

            {/* Files Grid/List */}
            {filteredFiles.length === 0 ? (
              <div className="files-empty">
                <Search size={40} className="empty-icon" />
                <p className="empty-title">No files found</p>
                <p className="empty-subtitle">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <motion.div 
                className={viewMode === 'grid' ? 'files-grid' : 'files-list'}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeFolder + viewMode}
              >
                {viewMode === 'list' && (
                  <div className="flist-header">
                    <div className="flist-h-name">Name</div>
                    <div className="flist-h-size">Size</div>
                    <div className="flist-h-date">Modified</div>
                    <div className="flist-h-owner">Owner</div>
                    <div className="flist-h-action"></div>
                  </div>
                )}

                {filteredFiles.map(file => {
                  const typeClass = getFileColorClass(file.type);
                  
                  if (viewMode === 'list') {
                    return (
                      <motion.div key={file.id} variants={itemVariants} className="file-list-item">
                        <div className="flist-name-col">
                          <div className={`file-icon-box ${typeClass}`}>
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flist-name-meta">
                            <span className="flist-name">{file.name}</span>
                            <span className="flist-version">{file.version}</span>
                          </div>
                        </div>
                        <div className="flist-size-col">{file.size}</div>
                        <div className="flist-date-col">{file.modified}</div>
                        <div className="flist-owner-col">
                          <Avatar src={file.owner.avatarUrl} alt={file.owner.name} fallback={file.owner.initials} size="sm" />
                          <span>{file.owner.name}</span>
                        </div>
                        <div className="flist-action-col">
                          <button className="file-action-btn"><Download size={14} /></button>
                          <button className="file-action-btn"><MoreVertical size={14} /></button>
                        </div>
                      </motion.div>
                    );
                  }

                  // Grid View
                  return (
                    <motion.div key={file.id} variants={itemVariants}>
                      <Card className="file-card" hoverable>
                        <div className="fcard-header">
                          <div className={`file-icon-box ${typeClass}`}>
                            {getFileIcon(file.type)}
                          </div>
                          <button className="file-action-btn"><MoreVertical size={16} /></button>
                        </div>
                        <div className="fcard-body">
                          <h3 className="fcard-name" title={file.name}>{file.name}</h3>
                          <div className="fcard-meta">
                            <span>{file.version}</span>
                            <span>•</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                        <div className="fcard-footer">
                          <div className="fcard-owner">
                            <Avatar src={file.owner.avatarUrl} alt={file.owner.name} fallback={file.owner.initials} size="sm" />
                            <span className="fcard-date">{file.modified}</span>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* In-progress Uploads (Mock) */}
            <div className="files-uploads-section">
              <h3 className="section-label">Uploading (1)</h3>
              <Card className="upload-progress-card">
                <div className="up-info">
                  <div className="up-icon"><FileBox size={16} /></div>
                  <div className="up-meta">
                    <span className="up-name">Brand_Assets_2026.zip</span>
                    <span className="up-status">Uploading... 45% (3.2 MB / 7.1 MB)</span>
                  </div>
                </div>
                <Progress value={45} variant="default" />
              </Card>
            </div>
          </div>

          {/* ── Side Panel ── */}
          <div className="files-side-panel">
            
            {/* AI Insights Panel */}
            <Card className="ai-files-card">
              <div className="ai-files-header">
                <Sparkles size={16} className="ai-files-icon" />
                <h3 className="ai-files-title">Orqon AI Insights</h3>
              </div>
              <div className="ai-files-content">
                <div className="ai-insight-item warning">
                  <AlertTriangle size={14} className="ai-warn-icon" />
                  <p><strong>Product_Requirements_v2.pdf</strong> differs significantly from v1. Do you want to generate a changelog?</p>
                </div>
                <div className="ai-insight-item">
                  <Sparkles size={14} className="ai-info-icon" />
                  <p>3 deliverables are ready for client review. Create portal link?</p>
                </div>
                <Button variant="secondary" size="sm" fullWidth>Review Differences</Button>
              </div>
            </Card>

            {/* Deliverables Summary */}
            <Card className="files-side-card">
              <div className="side-card-header">
                <h3 className="side-card-title">Deliverables</h3>
                <Badge variant="healthy">{deliverables.length}</Badge>
              </div>
              <div className="side-list">
                {deliverables.map(d => (
                  <div key={d.id} className="side-list-item">
                    <div className="side-list-icon"><CheckCircle2 size={14} className="icon-success" /></div>
                    <div className="side-list-info">
                      <span className="side-list-name" title={d.name}>{d.name}</span>
                      <span className="side-list-meta">{d.version} • {d.owner.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Uploads */}
            <Card className="files-side-card">
              <div className="side-card-header">
                <h3 className="side-card-title">Recent Activity</h3>
              </div>
              <div className="side-list">
                {recentUploads.map(r => (
                  <div key={r.id} className="side-list-item">
                    <Avatar src={r.owner.avatarUrl} alt={r.owner.name} fallback={r.owner.initials} size="sm" />
                    <div className="side-list-info">
                      <span className="side-list-action"><strong>{r.owner.name}</strong> uploaded</span>
                      <span className="side-list-name" title={r.name}>{r.name}</span>
                      <span className="side-list-meta">{r.modified}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      )}
    </motion.div>
  );
};

// Extracted to avoid import errors (used in deliverables side list)
const CheckCircle2: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default FilesAndDeliverables;
