import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send,
  FileText,
  Sparkles,
  ArrowLeft,
  Hash
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Avatar, AvatarGroup } from '../../components/ui/Avatar';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';

import { mockUsers, mockProjects } from '../../services/mockData';
import './Discussion.css';

// ---- Local Mock Data for Discussion ----
interface Message {
  id: string;
  user: typeof mockUsers['sarah'];
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
  attachments?: { id: string; name: string; size: string; type: string }[];
  reactions?: { emoji: string; count: number; reacted: boolean }[];
}

interface Channel {
  id: string;
  name: string;
  unread?: number;
  isPrivate?: boolean;
}

const mockChannels: Channel[] = [
  { id: 'ch1', name: 'general' },
  { id: 'ch2', name: 'design-handoff', unread: 3 },
  { id: 'ch3', name: 'engineering', unread: 0 },
  { id: 'ch4', name: 'backend-api', unread: 1 },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    user: mockUsers.sarah,
    text: 'Hey team, I just pushed the final version of the database schema for the new module. Can everyone please review it by EOD?',
    timestamp: '10:30 AM',
    isCurrentUser: false,
    reactions: [{ emoji: '👍', count: 2, reacted: true }, { emoji: '👀', count: 1, reacted: false }]
  },
  {
    id: 'm2',
    user: mockUsers.elena,
    text: 'Looks good from the design side. However, I noticed we might need an extra field for user preferences on the frontend. Should we add it now or later?',
    timestamp: '10:45 AM',
    isCurrentUser: false,
  },
  {
    id: 'm3',
    user: mockUsers.rahul,
    text: 'I can add the field now, it won\'t take much time. Here is the updated API spec draft for the new endpoints.',
    timestamp: '11:15 AM',
    isCurrentUser: true,
    attachments: [
      { id: 'a1', name: 'api_spec_v2.pdf', size: '2.4 MB', type: 'pdf' }
    ],
    reactions: [{ emoji: '🙌', count: 1, reacted: false }]
  }
];

const Discussion: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = mockProjects.find(p => p.id === projectId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState('ch2');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
      // Simulate someone typing shortly after load
      setTimeout(() => setIsTyping(true), 2000);
      setTimeout(() => setIsTyping(false), 6000);
    }, 600);
    return () => clearTimeout(timer);
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isLoading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      user: mockUsers.rahul, // Assuming current user is Rahul
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
  };

  return (
    <motion.div 
      className="discussion-page"
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      {/* ── Page Header ── */}
      <div className="disc-page-header">
        <div className="disc-header-left">
          <Link to={`/projects/${projectId}`} className="disc-back-link">
            <ArrowLeft size={16} />
            <span>Back to Project</span>
          </Link>
          <div className="disc-title-row">
            <h1 className="disc-page-title">Team Discussion</h1>
            <Badge variant="default">{project?.title || 'Unknown Project'}</Badge>
          </div>
        </div>
        <div className="disc-header-actions">
          <AvatarGroup max={4}>
            {project?.team.map(m => (
              <Avatar key={m.id} src={m.avatarUrl} alt={m.name} fallback={m.initials} size="sm" />
            ))}
          </AvatarGroup>
          <Button variant="outline" leftIcon={<Search size={14} />}>Search</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="disc-skeleton-layout">
          <Skeleton className="disc-skel-sidebar" />
          <Skeleton className="disc-skel-main" />
          <Skeleton className="disc-skel-side" />
        </div>
      ) : (
        <div className="disc-layout">
          
          {/* ── Channels Sidebar ── */}
          <div className="disc-sidebar">
            <div className="disc-sidebar-header">
              <h2 className="disc-sidebar-title">Channels</h2>
              <button className="disc-add-btn" aria-label="Add channel">
                <Plus size={16} />
              </button>
            </div>
            <ul className="disc-channel-list">
              {mockChannels.map(ch => (
                <li key={ch.id}>
                  <button 
                    className={`disc-channel-item ${activeChannel === ch.id ? 'active' : ''}`}
                    onClick={() => setActiveChannel(ch.id)}
                  >
                    <Hash size={14} className="disc-channel-icon" />
                    <span className="disc-channel-name">{ch.name}</span>
                    {ch.unread ? (
                      <span className="disc-channel-badge">{ch.unread}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Main Chat Area ── */}
          <Card className="disc-chat-area">
            {/* Chat Header */}
            <div className="disc-chat-header">
              <div className="disc-chat-header-info">
                <Hash size={20} className="disc-chat-header-icon" />
                <h2 className="disc-chat-header-title">
                  {mockChannels.find(c => c.id === activeChannel)?.name}
                </h2>
              </div>
              <button className="disc-icon-btn" aria-label="Channel settings">
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="disc-messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`disc-message-row ${msg.isCurrentUser ? 'current-user' : ''}`}>
                  {!msg.isCurrentUser && (
                    <Avatar src={msg.user.avatarUrl} alt={msg.user.name} fallback={msg.user.initials} />
                  )}
                  <div className="disc-message-content">
                    <div className="disc-message-meta">
                      <span className="disc-message-author">{msg.isCurrentUser ? 'You' : msg.user.name}</span>
                      <span className="disc-message-time">{msg.timestamp}</span>
                    </div>
                    
                    <div className="disc-message-bubble">
                      <p>{msg.text}</p>
                      
                      {/* Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="disc-msg-attachments">
                          {msg.attachments.map(att => (
                            <div key={att.id} className="disc-msg-attachment">
                              <FileText size={16} className="disc-att-icon" />
                              <div className="disc-att-info">
                                <span className="disc-att-name">{att.name}</span>
                                <span className="disc-att-size">{att.size}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="disc-msg-reactions">
                        {msg.reactions.map((r, i) => (
                          <span key={i} className={`disc-reaction ${r.reacted ? 'reacted' : ''}`}>
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="disc-message-row typing">
                  <Avatar src={mockUsers.sarah.avatarUrl} alt="Sarah" fallback="SC" />
                  <div className="disc-message-content">
                    <div className="disc-typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="disc-chat-input-area">
              <form className="disc-chat-form" onSubmit={handleSendMessage}>
                <button type="button" className="disc-icon-btn disc-attach-btn" aria-label="Attach file">
                  <Paperclip size={18} />
                </button>
                <input 
                  type="text" 
                  className="disc-chat-input" 
                  placeholder={`Message #${mockChannels.find(c => c.id === activeChannel)?.name}...`}
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                />
                <button type="button" className="disc-icon-btn disc-emoji-btn" aria-label="Add emoji">
                  <Smile size={18} />
                </button>
                <button 
                  type="submit" 
                  className="disc-send-btn" 
                  disabled={!messageText.trim()}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </Card>

          {/* ── AI Summary Panel ── */}
          <div className="disc-side-panel">
            <Card className="disc-ai-card">
              <div className="disc-ai-header">
                <Sparkles size={16} className="disc-ai-icon" />
                <h3 className="disc-ai-title">AI Discussion Summary</h3>
              </div>
              <div className="disc-ai-content">
                <p className="disc-ai-desc">
                  Based on recent messages in <strong>#design-handoff</strong>, here is a quick summary:
                </p>
                <ul className="disc-ai-points">
                  <li>Sarah pushed final DB schema for review.</li>
                  <li>Elena requested an extra user preference field.</li>
                  <li>Rahul agreed to add it and shared API spec v2.</li>
                </ul>
                <div className="disc-ai-action">
                  <Button variant="secondary" size="sm" fullWidth>Generate Action Items</Button>
                </div>
              </div>
            </Card>
          </div>
          
        </div>
      )}
    </motion.div>
  );
};

export default Discussion;
