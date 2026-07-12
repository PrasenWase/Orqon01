import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Check, 
  CheckCheck,
  MessageSquare,
  CheckCircle2,
  FileText,
  Settings,
  MoreVertical,
  Sparkles,
  AlertTriangle,
  Clock
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

import { mockUsers } from '../../services/mockData';
import './Notifications.css';

// ---- Local Mock Data ----
type NotifCategory = 'all' | 'mentions' | 'tasks' | 'files' | 'system';
type NotifType = 'mention' | 'task_assign' | 'task_complete' | 'file_upload' | 'system_alert';

interface NotificationItem {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  user?: typeof mockUsers['sarah'];
  projectId?: string;
  projectTitle?: string;
}

const mockNotifs: NotificationItem[] = [
  {
    id: 'n1',
    type: 'mention',
    title: 'Mentioned you in a comment',
    message: '@current_user can you review the latest Figma file for the onboarding flow?',
    timestamp: '10 mins ago',
    isRead: false,
    priority: 'high',
    user: mockUsers.elena,
    projectTitle: 'Orqon Redesign'
  },
  {
    id: 'n2',
    type: 'task_assign',
    title: 'Assigned you a new task',
    message: 'Implement FaceID authentication fallback',
    timestamp: '1 hour ago',
    isRead: false,
    priority: 'high',
    user: mockUsers.sarah,
    projectTitle: 'Mobile App v2'
  },
  {
    id: 'n3',
    type: 'file_upload',
    title: 'Uploaded a new file',
    message: 'Q3_Financial_Projections_Final.xlsx',
    timestamp: '3 hours ago',
    isRead: true,
    priority: 'medium',
    user: mockUsers.marcus,
    projectTitle: 'Q3 Planning'
  },
  {
    id: 'n4',
    type: 'task_complete',
    title: 'Completed a task',
    message: 'Design system typography audit',
    timestamp: 'Yesterday',
    isRead: true,
    priority: 'low',
    user: mockUsers.elena,
    projectTitle: 'Orqon Redesign'
  },
  {
    id: 'n5',
    type: 'system_alert',
    title: 'System Maintenance',
    message: 'Scheduled downtime for database upgrade this Saturday at 2:00 AM UTC.',
    timestamp: '2 days ago',
    isRead: true,
    priority: 'medium',
  },
];

const getIconForType = (type: NotifType) => {
  switch (type) {
    case 'mention': return <MessageSquare size={16} />;
    case 'task_assign': return <Check size={16} />;
    case 'task_complete': return <CheckCircle2 size={16} />;
    case 'file_upload': return <FileText size={16} />;
    case 'system_alert': return <Settings size={16} />;
    default: return <Bell size={16} />;
  }
};

const getColorClassForType = (type: NotifType) => {
  switch (type) {
    case 'mention': return 'notif-color-blue';
    case 'task_assign': return 'notif-color-orange';
    case 'task_complete': return 'notif-color-green';
    case 'file_upload': return 'notif-color-purple';
    case 'system_alert': return 'notif-color-gray';
    default: return '';
  }
};

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<NotifCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setNotifications(mockNotifs);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifs = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'mentions') return n.type === 'mention';
    if (activeCategory === 'tasks') return n.type === 'task_assign' || n.type === 'task_complete';
    if (activeCategory === 'files') return n.type === 'file_upload';
    if (activeCategory === 'system') return n.type === 'system_alert';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.div 
      className="notif-page"
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      {/* ── Page Header ── */}
      <div className="notif-header">
        <div className="notif-title-row">
          <h1 className="notif-page-title">Notifications</h1>
          {unreadCount > 0 && <Badge variant="healthy">{unreadCount} New</Badge>}
        </div>
        <div className="notif-header-actions">
          <Button 
            variant="ghost" 
            leftIcon={<CheckCheck size={16} />}
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="notif-skeleton-layout">
          <div className="notif-grid">
            <div className="notif-main">
              <Skeleton height="60px" className="mb-4" />
              <Skeleton height="100px" className="mb-3" />
              <Skeleton height="100px" className="mb-3" />
              <Skeleton height="100px" />
            </div>
            <div className="notif-side">
              <Skeleton height="250px" />
            </div>
          </div>
        </div>
      ) : (
        <div className="notif-layout">
          
          {/* ── Main Content Area ── */}
          <div className="notif-main">
            
            {/* Controls Row */}
            <div className="notif-controls">
              <nav className="notif-tabs" aria-label="Notification categories">
                {(['all', 'mentions', 'tasks', 'files', 'system'] as NotifCategory[]).map(cat => (
                  <button 
                    key={cat}
                    className={`notif-tab ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </nav>

              <div className="notif-search-container">
                <Search size={14} className="notif-search-icon" />
                <input
                  type="search"
                  placeholder="Search notifications…"
                  className="notif-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Notifications List */}
            {filteredNotifs.length === 0 ? (
              <div className="notif-empty">
                <Bell size={48} className="empty-icon" />
                <h3 className="empty-title">All caught up!</h3>
                <p className="empty-subtitle">You have no notifications in this category.</p>
              </div>
            ) : (
              <motion.div 
                className="notif-list"
                variants={listVariants}
                initial="hidden"
                animate="show"
                key={activeCategory}
              >
                {filteredNotifs.map(notif => (
                  <motion.div 
                    key={notif.id} 
                    variants={itemVariants}
                  >
                    <Card className={`notif-card ${!notif.isRead ? 'unread' : ''}`}>
                      <div className="notif-card-inner">
                        {/* Status dot */}
                        <div className="notif-read-status">
                          {!notif.isRead && <div className="unread-dot"></div>}
                        </div>

                        {/* Avatar / Icon */}
                        <div className="notif-avatar-col">
                          {notif.user ? (
                            <div className="notif-avatar-wrapper">
                              <Avatar src={notif.user.avatarUrl} alt={notif.user.name} fallback={notif.user.initials} />
                              <div className={`notif-type-icon ${getColorClassForType(notif.type)}`}>
                                {getIconForType(notif.type)}
                              </div>
                            </div>
                          ) : (
                            <div className={`notif-sys-icon ${getColorClassForType(notif.type)}`}>
                              {getIconForType(notif.type)}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="notif-content-col">
                          <div className="notif-meta-top">
                            <span className="notif-author">
                              {notif.user ? notif.user.name : 'System'}
                            </span>
                            <span className="notif-action-text">{notif.title}</span>
                            {notif.projectTitle && (
                              <span className="notif-project">in <strong>{notif.projectTitle}</strong></span>
                            )}
                          </div>
                          
                          <p className="notif-message">{notif.message}</p>
                          
                          <div className="notif-meta-bottom">
                            <Clock size={12} className="notif-time-icon" />
                            <span className="notif-time">{notif.timestamp}</span>
                            {notif.priority === 'high' && (
                              <span className="notif-priority-badge high">High Priority</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="notif-actions-col">
                          {!notif.isRead && (
                            <button 
                              className="notif-action-btn"
                              onClick={() => handleMarkAsRead(notif.id)}
                              aria-label="Mark as read"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button className="notif-action-btn" aria-label="More options">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Side Panel ── */}
          <div className="notif-side-panel">
            {/* AI Summary Panel */}
            <Card className="ai-notif-card">
              <div className="ai-notif-header">
                <Sparkles size={16} className="ai-notif-icon" />
                <h3 className="ai-notif-title">Orqon AI Inbox Summary</h3>
              </div>
              <div className="ai-notif-content">
                <p className="ai-notif-desc">
                  You have <strong>2 action items</strong> needing attention today.
                </p>
                
                <div className="ai-notif-item">
                  <AlertTriangle size={14} className="ai-warn-icon" />
                  <div className="ai-item-text">
                    <strong>High Priority:</strong> Elena requested review on the Onboarding flow.
                  </div>
                </div>
                
                <div className="ai-notif-item">
                  <Check size={14} className="ai-info-icon" />
                  <div className="ai-item-text">
                    <strong>Task:</strong> You were assigned "FaceID authentication fallback".
                  </div>
                </div>

                <div className="ai-notif-actions">
                  <Button variant="secondary" size="sm" fullWidth>Jump to Mentions</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;
