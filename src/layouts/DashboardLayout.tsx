import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Layers,
  LayoutDashboard,
  Folders,
  Zap,
  MessageSquare,
  FileText,
  Bell,
  Users,
  Settings,
  Search,
  History,
  ChevronDown,
  LogOut,
  Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { mockNotifications } from '../services/mockData';
import './DashboardLayout.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const primaryNav: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: Folders },
  { path: '/discussion', label: 'Discussion', icon: MessageSquare, badge: 3 },
  { path: '/files', label: 'Files & Deliverables', icon: FileText },
  { path: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { path: '/client', label: 'Client Portal', icon: Users },
  { path: '/ai', label: 'Orqon AI', icon: Zap },
];

const secondaryNav: NavItem[] = [
  { path: '/settings', label: 'Settings', icon: Settings },
];

const unreadCount = mockNotifications.filter((n) => !n.read).length;

const DashboardLayout: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="dashboard-sidebar" aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-header">
          <button
            className="sidebar-logo"
            onClick={() => navigate('/dashboard')}
            aria-label="Go to dashboard"
          >
            <Layers size={24} className="logo-icon" />
            <div className="logo-text">
              <span className="logo-title">Orqon</span>
              <span className="logo-subtitle">Enterprise AI</span>
            </div>
          </button>
        </div>

        {/* Workspace switcher */}
        <div className="sidebar-workspace">
          <button className="workspace-btn">
            <div className="workspace-icon">A</div>
            <div className="workspace-info">
              <span className="workspace-name">Apollo Fintech</span>
              <span className="workspace-role">Manager</span>
            </div>
            <ChevronDown size={14} className="workspace-chevron" />
          </button>
        </div>

        {/* Primary Nav */}
        <nav className="sidebar-nav" aria-label="Primary">
          {primaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
              aria-label={item.label}
            >
              <item.icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div className="sidebar-spacer" />

        {/* Secondary Nav */}
        <nav className="sidebar-nav sidebar-secondary-nav" aria-label="Secondary">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' active' : ''}`
              }
            >
              <item.icon size={18} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <Avatar
              src="https://i.pravatar.cc/150?u=admin-orqon"
              alt="Admin User"
              size="md"
              fallback="AU"
            />
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Manager</span>
            </div>
            <button className="user-logout-btn" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="search"
                placeholder="Search workspaces, projects, tasks..."
                className="search-input"
                aria-label="Search"
              />
              <span className="search-shortcut">⌘K</span>
            </div>
          </div>

          <div className="header-right">
            <button className="header-action-btn" aria-label="Toggle dark mode">
              <Moon size={18} />
            </button>
            <div className="header-divider" />

            {/* Notification Bell */}
            <div className="notif-wrapper">
              <button
                className="header-icon-btn"
                onClick={() => setNotifOpen((p) => !p)}
                aria-label={`Notifications — ${unreadCount} unread`}
                aria-expanded={notifOpen}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="notif-dot">{unreadCount}</span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div
                      className="notif-backdrop"
                      onClick={() => setNotifOpen(false)}
                    />
                    <motion.div
                      className="notif-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      role="dialog"
                      aria-label="Notifications"
                    >
                      <div className="notif-header">
                        <span className="notif-title">Notifications</span>
                        <Badge variant="ai">{unreadCount} New</Badge>
                      </div>
                      <ul className="notif-list">
                        {mockNotifications.map((n) => (
                          <li
                            key={n.id}
                            className={`notif-item${n.read ? ' notif-read' : ''}`}
                          >
                            <div className={`notif-type-dot notif-type-${n.type}`} />
                            <div className="notif-body">
                              <span className="notif-item-title">{n.title}</span>
                              <span className="notif-item-body">{n.body}</span>
                              <span className="notif-timestamp">{n.timestamp}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="notif-footer">
                        <NavLink to="/notifications" onClick={() => setNotifOpen(false)}>
                          View all notifications
                        </NavLink>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="header-icon-btn" aria-label="Activity history">
              <History size={18} />
            </button>

            <div className="header-divider" />

            <div className="header-profile">
              <Avatar
                src="https://i.pravatar.cc/150?u=admin-orqon"
                alt="Admin User"
                size="sm"
                fallback="AU"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
