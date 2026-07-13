import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockNotifications, mockUsers, type Notification } from '../../services/mockData';
import './Notifications.css';

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const notificationUsers = {
  ai: mockUsers.sarah,
  task: mockUsers.rahul,
  mention: mockUsers.elena,
  deadline: mockUsers.priya,
} satisfies Record<Notification['type'], (typeof mockUsers)[keyof typeof mockUsers]>;

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const notifications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return mockNotifications;

    return mockNotifications.filter(({ title, body }) =>
      `${title} ${body}`.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <motion.section
      className="notifications-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-labelledby="notifications-title"
    >
      <header className="notifications-header">
        <div>
          <h1 id="notifications-title" className="notifications-title">Notifications</h1>
          <p className="notifications-subtitle">Stay up to date with your projects and team.</p>
        </div>
        <Badge variant="default">{mockNotifications.filter((notification) => !notification.read).length} New</Badge>
      </header>

      <div className="notifications-search">
        <Input
          type="search"
          placeholder="Search notifications"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          leftIcon={<Search size={16} aria-hidden="true" />}
          aria-label="Search notifications"
        />
      </div>

      {isLoading ? (
        <div className="notifications-skeleton-list" aria-label="Loading notifications">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card className="notification-card notification-card-skeleton" key={index}>
              <Skeleton circle width="40px" height="40px" />
              <div className="notification-skeleton-content">
                <Skeleton height="14px" className="notification-skeleton-title" />
                <Skeleton height="12px" className="notification-skeleton-body" />
                <Skeleton height="11px" className="notification-skeleton-time" />
              </div>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty-state">
          <Search size={32} aria-hidden="true" />
          <h2>No notifications found</h2>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <motion.ul
          className="notifications-list"
          variants={listVariants}
          initial="hidden"
          animate="show"
          key={searchQuery}
        >
          {notifications.map((notification) => {
            const user = notificationUsers[notification.type];

            return (
              <motion.li key={notification.id} variants={itemVariants}>
                <Card className={`notification-card${notification.read ? ' notification-read' : ' notification-unread'}`} hoverable>
                  <div className={`notification-indicator notification-indicator-${notification.type}`} aria-hidden="true" />
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    fallback={user.initials}
                    size="md"
                  />
                  <div className="notification-content">
                    <h2 className="notification-title">{notification.title}</h2>
                    <p className="notification-description">{notification.body}</p>
                    <time className="notification-timestamp">{notification.timestamp}</time>
                  </div>
                  {!notification.read && <span className="notification-unread-dot" aria-label="Unread" />}
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </motion.section>
  );
};

export default Notifications;
