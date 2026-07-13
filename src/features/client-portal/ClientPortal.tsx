import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  MessageSquare,
  Search,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Progress } from '../../components/ui/Progress';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockProjects, mockUsers } from '../../services/mockData';
import './ClientPortal.css';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const ClientPortal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const project = mockProjects.find(({ id }) => id === 'p1')!;

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="client-portal" aria-label="Loading client portal">
        <div className="client-portal-skeleton-header">
          <Skeleton className="client-portal-skeleton-title" height="30px" />
          <Skeleton className="client-portal-skeleton-subtitle" height="16px" />
        </div>
        <div className="client-portal-skeleton-stats">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height="126px" />
          ))}
        </div>
        <div className="client-portal-skeleton-content">
          <Skeleton height="290px" />
          <Skeleton height="290px" />
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="client-portal"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      aria-labelledby="client-portal-title"
    >
      <motion.header className="client-portal-header" variants={sectionVariants}>
        <div>
          <p className="client-portal-eyebrow">Client Portal</p>
          <h1 id="client-portal-title" className="client-portal-title">{project.title}</h1>
          <p className="client-portal-client">Apollo Fintech Solutions</p>
        </div>
        <div className="client-portal-search">
          <Input
            type="search"
            placeholder="Search project"
            aria-label="Search project"
            leftIcon={<Search size={16} aria-hidden="true" />}
          />
        </div>
      </motion.header>

      <motion.nav className="client-portal-nav" variants={sectionVariants} aria-label="Client portal sections">
        <button className="client-portal-nav-item client-portal-nav-active" type="button">Progress</button>
        <button className="client-portal-nav-item" type="button">Deliverables</button>
        <button className="client-portal-nav-item" type="button">Feedback</button>
        <button className="client-portal-nav-item" type="button">Settings</button>
      </motion.nav>

      <motion.div className="client-portal-stat-grid" variants={sectionVariants}>
        <Card className="client-portal-stat-card">
          <span className="client-portal-stat-label">Progress</span>
          <strong className="client-portal-stat-value">68%</strong>
          <Progress value={68} variant="healthy" />
        </Card>

        <Card className="client-portal-stat-card">
          <span className="client-portal-stat-label">Milestones</span>
          <strong className="client-portal-stat-value">4 / 6</strong>
          <span className="client-portal-stat-detail">Next: Testing</span>
        </Card>

        <Card className="client-portal-stat-card">
          <span className="client-portal-stat-label">Deliverables</span>
          <strong className="client-portal-stat-value">2</strong>
          <span className="client-portal-stat-detail">Pending</span>
        </Card>

        <Card className="client-portal-stat-card">
          <span className="client-portal-stat-label">Next Deadline</span>
          <strong className="client-portal-deadline">Beta Launch</strong>
          <span className="client-portal-stat-detail">8 Days Left</span>
        </Card>
      </motion.div>

      <div className="client-portal-primary-grid">
        <motion.div variants={sectionVariants}>
          <Card className="client-portal-card client-portal-progress-card">
            <div className="client-portal-card-heading">
              <div>
                <h2>Overall Progress</h2>
                <p>Delivery Date <strong>Oct 24, 2024</strong></p>
              </div>
              <Badge variant="healthy">On Track</Badge>
            </div>

            <div className="client-portal-progress-figure">
              <strong>68%</strong>
              <Progress value={68} variant="healthy" />
            </div>

            <div className="client-portal-timeline-header">
              <h3>Progress Timeline</h3>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>View Roadmap</Button>
            </div>

            <ol className="client-portal-timeline">
              <li className="timeline-complete"><span>Planning</span><em>Completed</em></li>
              <li className="timeline-complete"><span>Design</span><em>Completed</em></li>
              <li className="timeline-current"><span>Development</span><em>In Progress 75%</em></li>
              <li><span>Testing</span><em>Upcoming</em></li>
              <li><span>Deployment</span><em>Upcoming</em></li>
            </ol>
          </Card>
        </motion.div>

        <motion.div className="client-portal-side-stack" variants={sectionVariants}>
          <Card className="client-portal-card client-portal-ai-card">
            <div className="client-portal-card-heading">
              <h2>Orqon AI Summary</h2>
              <Badge variant="ai">AI</Badge>
            </div>
            <p>Project is currently on schedule. Next milestone begins in 3 days. No risks detected in current development velocity.</p>
          </Card>

          <Card className="client-portal-card client-portal-manager-card">
            <h2>Project Manager</h2>
            <div className="client-portal-manager">
              <Avatar src={mockUsers.sarah.avatarUrl} alt={mockUsers.sarah.name} fallback={mockUsers.sarah.initials} size="lg" />
              <div>
                <strong>Sarah Chen</strong>
                <span>Lead Coordinator</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="client-portal-secondary-grid">
        <motion.div variants={sectionVariants}>
          <Card className="client-portal-card client-portal-deliverables-card">
            <div className="client-portal-card-heading">
              <h2>Key Deliverables</h2>
              <Badge variant="default">2 Pending</Badge>
            </div>
            <div className="client-portal-deliverables-table" role="table" aria-label="Key deliverables">
              <div className="client-portal-deliverable-head" role="row">
                <span>Deliverable Name</span><span>Status</span><span>Version</span><span>Date</span><span>Actions</span>
              </div>
              <div className="client-portal-deliverable-row" role="row">
                <span>Brand Identity Guidelines</span><Badge variant="healthy">Approved</Badge><span>v2.1</span><span>Oct 02</span><Button variant="ghost" size="sm" leftIcon={<Download size={13} />}>Download</Button>
              </div>
              <div className="client-portal-deliverable-row" role="row">
                <span>Mobile App Mockups</span><Badge variant="healthy">Approved</Badge><span>v1.4</span><span>Oct 10</span><Button variant="ghost" size="sm" leftIcon={<Download size={13} />}>Download</Button>
              </div>
              <div className="client-portal-deliverable-row" role="row">
                <span>Functional Specification</span><Badge variant="at-risk">Pending</Badge><span>v0.9</span><span>Oct 15</span><Button variant="ghost" size="sm">Review</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Card className="client-portal-card client-portal-meetings-card">
            <h2>Upcoming Meetings</h2>
            <div className="client-portal-meeting">
              <div className="client-portal-meeting-date"><span>OCT</span><strong>18</strong></div>
              <div><strong>Sprint Sync</strong><span><Clock size={13} />10:00 AM · Google Meet</span></div>
            </div>
            <div className="client-portal-meeting">
              <div className="client-portal-meeting-date"><span>OCT</span><strong>21</strong></div>
              <div><strong>Deliverable Review</strong><span><Clock size={13} />02:30 PM · Zoom</span></div>
            </div>
            <div className="client-portal-meeting-actions">
              <Button variant="outline" size="sm" leftIcon={<MessageSquare size={14} />}>Leave Feedback</Button>
              <Button size="sm" leftIcon={<Calendar size={14} />}>Schedule Meeting</Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={sectionVariants}>
        <Card className="client-portal-card client-portal-activity-card">
          <h2>Recent Activity</h2>
          <div className="client-portal-activity-list">
            <div className="client-portal-activity">
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>Design Approved</strong><p>The v1.4 Mobile Mockups were reviewed and approved by Apollo Stakeholders.</p></div>
              <time>Today · 2:14 PM</time>
            </div>
            <div className="client-portal-activity">
              <CheckCircle2 size={18} aria-hidden="true" />
              <div><strong>Testing Started</strong><p>Initial QA suite execution on development build 124 has commenced.</p></div>
              <time>Yesterday · 9:30 AM</time>
            </div>
            <div className="client-portal-activity">
              <MessageSquare size={18} aria-hidden="true" />
              <div><strong>Client Feedback Received</strong><p>Feedback provided on Brand Guidelines for version finalization.</p></div>
              <time>Oct 14 · 4:00 PM</time>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.section>
  );
};

export default ClientPortal;
