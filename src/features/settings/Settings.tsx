import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  CircleHelp,
  LockKeyhole,
  Monitor,
  Palette,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Checkbox } from '../../components/ui/Checkbox';
import { Input } from '../../components/ui/Input';
import './Settings.css';

type SettingsSection = 'profile' | 'notifications' | 'security' | 'appearance' | 'about';

const navItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'about', label: 'About', icon: CircleHelp },
];

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState('Medium');

  return (
    <motion.section
      className="settings-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-labelledby="settings-title"
    >
      <header className="settings-header">
        <h1 id="settings-title">Settings</h1>
        <p>Manage your account, workspace, and preferences.</p>
      </header>

      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              className={`settings-nav-item${activeSection === id ? ' settings-nav-active' : ''}`}
              key={id}
              onClick={() => setActiveSection(id)}
              type="button"
            >
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {activeSection === 'profile' && (
            <Card className="settings-card">
              <div className="settings-card-header">
                <div><h2>Profile</h2><p>Update your personal information and presence.</p></div>
              </div>
              <div className="settings-profile-avatar">
                <Avatar alt="Alex Chen" fallback="AC" size="lg" />
                <div><strong>Alex Chen</strong><span>Senior Product Designer</span></div>
              </div>
              <div className="settings-form-grid">
                <Input label="Full Name" defaultValue="Alex Chen" />
                <Input label="Username" defaultValue="achen@orqon" />
                <Input label="Email" type="email" defaultValue="alexchen@orqon.ai" />
                <Input label="Job Title" defaultValue="Senior Product Designer" />
                <Input label="Timezone" defaultValue="UTC-8 Pacific Time" />
                <Input label="Language" defaultValue="English (US)" />
              </div>
              <div className="settings-card-footer"><Button>Save Changes</Button></div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="settings-card">
              <div className="settings-card-header"><div><h2>Notifications</h2><p>Configure how and when you want to be alerted.</p></div></div>
              <div className="settings-notification-grid settings-notification-head">
                <span>Notification Type</span><span>Email</span><span>Desktop</span><span>Mobile</span>
              </div>
              <div className="settings-notification-grid">
                <div><strong>Task Assigned</strong><span>When someone assigns a task to you</span></div>
                <Checkbox defaultChecked aria-label="Email task assigned notifications" />
                <Checkbox defaultChecked aria-label="Desktop task assigned notifications" />
                <Checkbox aria-label="Mobile task assigned notifications" />
              </div>
              <div className="settings-notification-grid">
                <div><strong>Mentions</strong><span>When someone tags you in a comment</span></div>
                <Checkbox defaultChecked aria-label="Email mention notifications" />
                <Checkbox defaultChecked aria-label="Desktop mention notifications" />
                <Checkbox defaultChecked aria-label="Mobile mention notifications" />
              </div>
              <div className="settings-notification-grid">
                <div><strong>Weekly Summary</strong><span>Digest of the past week’s activity</span></div>
                <Checkbox defaultChecked aria-label="Email weekly summary notifications" />
                <Checkbox aria-label="Desktop weekly summary notifications" />
                <Checkbox aria-label="Mobile weekly summary notifications" />
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <div className="settings-stack">
              <Card className="settings-card">
                <div className="settings-card-header"><div><h2>Security</h2><p>Protect your account with advanced security controls.</p></div></div>
                <div className="settings-action-row">
                  <div><strong>Change Password</strong><span>Last updated 3 months ago</span></div>
                  <Button variant="outline">Update Password</Button>
                </div>
                <div className="settings-action-row">
                  <div><strong>Two-Factor Authentication</strong><span>Add an extra layer of security to your account</span></div>
                  <Badge variant="healthy">Enabled</Badge>
                </div>
              </Card>
              <Card className="settings-card">
                <div className="settings-card-header"><div><h2>Active Sessions</h2><p>Manage devices currently signed into your account.</p></div></div>
                <div className="settings-action-row">
                  <div className="settings-session"><Monitor size={18} aria-hidden="true" /><div><strong>Chrome on macOS <em>Current</em></strong><span>San Francisco, USA · 192.168.1.1</span></div></div>
                  <Button variant="ghost" size="sm">Revoke</Button>
                </div>
                <div className="settings-card-footer"><Button variant="outline">Logout All Other Devices</Button></div>
              </Card>
            </div>
          )}

          {activeSection === 'appearance' && (
            <Card className="settings-card">
              <div className="settings-card-header"><div><h2>Appearance</h2><p>Customize the look and feel of your workspace.</p></div></div>
              <div className="settings-action-row"><div><strong>Theme</strong><span>Dark</span></div><Badge variant="default">Dark</Badge></div>
              <div className="settings-action-row"><div><strong>Accent Color</strong><span>Enterprise green</span></div><span className="settings-color-swatch" aria-label="Enterprise green" /></div>
              <div className="settings-action-row"><div><strong>Compact Mode</strong><span>Reduce whitespace for data-heavy views</span></div><Checkbox checked={compactMode} onChange={(event) => setCompactMode(event.target.checked)} aria-label="Enable compact mode" /></div>
              <div className="settings-font-size"><strong>Interface Font Size</strong><div>{['Small', 'Medium', 'Large'].map((size) => <button type="button" onClick={() => setFontSize(size)} className={`settings-font-option${fontSize === size ? ' settings-font-option-active' : ''}`} key={size}>{size}</button>)}</div></div>
            </Card>
          )}

          {activeSection === 'about' && (
            <Card className="settings-card settings-about-card">
              <LockKeyhole size={22} aria-hidden="true" />
              <h2>Orqon Enterprise Suite</h2>
              <p>Version 2.4.1 · Stable Build</p>
              <div className="settings-about-links">
                <a href="#privacy">Privacy Policy <ChevronRight size={14} /></a>
                <a href="#terms">Terms of Service <ChevronRight size={14} /></a>
                <a href="#help">Help Center <ChevronRight size={14} /></a>
                <a href="#support">Contact Support <ChevronRight size={14} /></a>
              </div>
              <small>© 2024 Orqon AI Technologies. Built for the modern enterprise.</small>
            </Card>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Settings;
