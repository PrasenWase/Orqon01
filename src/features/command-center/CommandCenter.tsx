import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  Send,
  Zap,
  Clock,
  Settings,
  MoreVertical,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BarChart2
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

import { mockUsers } from '../../services/mockData';
import './CommandCenter.css';

// ---- Local Mock Data ----
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  options?: { label: string; action: string }[];
  isThinking?: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'msg_0',
    sender: 'ai',
    text: 'Hello! I am Orqon AI. How can I help you coordinate your projects today?',
    timestamp: '10:00 AM'
  },
  {
    id: 'msg_1',
    sender: 'user',
    text: 'Summarize the latest updates for the Orqon Redesign project.',
    timestamp: '10:05 AM'
  },
  {
    id: 'msg_2',
    sender: 'ai',
    text: 'Here is the summary for the **Orqon Redesign** project:\n\n• **Elena** updated the UI components library (v4.0).\n• **Sarah** mentioned you in a comment regarding the onboarding flow.\n• 3 tasks were completed yesterday.\n\nYou have 2 high priority notifications pending.',
    timestamp: '10:05 AM',
    options: [
      { label: 'View Notifications', action: 'view_notifs' },
      { label: 'Generate Weekly Report', action: 'gen_report' }
    ]
  }
];

const quickPrompts = [
  { icon: <BarChart2 size={16} />, label: 'Project Status Report' },
  { icon: <Clock size={16} />, label: 'What is blocking us?' },
  { icon: <CheckCircle2 size={16} />, label: 'Assign tasks from notes' },
  { icon: <AlertTriangle size={16} />, label: 'Identify risks' },
];


const CommandCenter: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(initialMessages);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: 'I understand you are asking about that. I can generate a detailed analysis or create tasks based on your request. What would you like to do next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: [
          { label: 'Create Tasks', action: 'create' },
          { label: 'Detailed Analysis', action: 'analyze' }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleOptionClick = (label: string) => {
    setInputValue(label);
  };

  return (
    <motion.div 
      className="cmd-page"
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      {/* ── Page Header ── */}
      <div className="cmd-header">
        <div className="cmd-title-row">
          <Sparkles size={24} className="cmd-header-logo" />
          <h1 className="cmd-page-title">Orqon AI Command Center</h1>
          <Badge variant="healthy">Online</Badge>
        </div>
        <div className="cmd-header-actions">
          <Button variant="ghost" leftIcon={<Clock size={16} />}>History</Button>
          <Button variant="ghost" leftIcon={<Settings size={16} />}>Settings</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="cmd-skeleton-layout">
          <Skeleton className="cmd-skel-main" />
          <Skeleton className="cmd-skel-side" />
        </div>
      ) : (
        <div className="cmd-layout">
          
          {/* ── Main Chat Interface ── */}
          <Card className="cmd-chat-area">
            
            <div className="cmd-messages-container">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  className={`cmd-msg-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {msg.sender === 'ai' ? (
                    <div className="cmd-avatar-ai">
                      <Sparkles size={16} />
                    </div>
                  ) : (
                    <Avatar 
                      src={mockUsers.sarah.avatarUrl} 
                      alt="User" 
                      fallback="U" 
                      size="sm" 
                    />
                  )}
                  
                  <div className="cmd-msg-content">
                    <div className="cmd-msg-meta">
                      <span className="cmd-author">{msg.sender === 'ai' ? 'Orqon AI' : 'You'}</span>
                      <span className="cmd-time">{msg.timestamp}</span>
                    </div>
                    
                    <div className="cmd-bubble">
                      <p className="cmd-text">{msg.text}</p>
                    </div>

                    {msg.options && (
                      <div className="cmd-options-row">
                        {msg.options.map((opt, i) => (
                          <button 
                            key={i} 
                            className="cmd-option-btn"
                            onClick={() => handleOptionClick(opt.label)}
                          >
                            <Zap size={12} className="cmd-opt-icon" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="cmd-msg-row ai-row">
                  <div className="cmd-avatar-ai">
                    <Sparkles size={16} />
                  </div>
                  <div className="cmd-msg-content">
                    <div className="cmd-typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts (visible if messages are sparse, but we keep it at the bottom for design matching) */}
            <div className="cmd-quick-prompts">
              {quickPrompts.map((p, i) => (
                <button 
                  key={i} 
                  className="cmd-quick-prompt-btn"
                  onClick={() => setInputValue(p.label)}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="cmd-input-area">
              <form className="cmd-form" onSubmit={handleSend}>
                <button type="button" className="cmd-icon-btn" aria-label="Attach file">
                  <Paperclip size={18} />
                </button>
                <input 
                  type="text" 
                  className="cmd-input-field" 
                  placeholder="Ask Orqon AI to summarize, plan, or execute..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="cmd-send-btn" 
                  disabled={!inputValue.trim()}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="cmd-input-footer">
                AI can make mistakes. Consider verifying important information.
              </div>
            </div>
          </Card>

          {/* ── Side Panel (Context / Active Agents) ── */}
          <div className="cmd-side-panel">
            
            {/* Active Context */}
            <Card className="cmd-side-card">
              <div className="cmd-side-header">
                <h3 className="cmd-side-title">Active Context</h3>
                <button className="cmd-icon-btn"><MoreVertical size={16} /></button>
              </div>
              
              <div className="cmd-context-list">
                <div className="cmd-context-item">
                  <FileText size={16} className="cmd-ctx-icon" />
                  <div className="cmd-ctx-info">
                    <span className="cmd-ctx-name">Product_Requirements_v2.pdf</span>
                    <span className="cmd-ctx-meta">Added 10 mins ago</span>
                  </div>
                </div>
                <div className="cmd-context-item">
                  <CheckCircle2 size={16} className="cmd-ctx-icon" />
                  <div className="cmd-ctx-info">
                    <span className="cmd-ctx-name">Orqon Redesign (Project)</span>
                    <span className="cmd-ctx-meta">Synced</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" fullWidth leftIcon={<Paperclip size={14} />}>
                Add Context
              </Button>
            </Card>

            {/* AI Capabilities */}
            <Card className="cmd-side-card">
              <div className="cmd-side-header">
                <h3 className="cmd-side-title">Capabilities</h3>
              </div>
              <ul className="cmd-cap-list">
                <li><Zap size={14} /> Project Summarization</li>
                <li><Zap size={14} /> Task Generation</li>
                <li><Zap size={14} /> Document Analysis</li>
                <li><Zap size={14} /> Resource Allocation</li>
                <li><Zap size={14} /> Risk Identification</li>
              </ul>
            </Card>

          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CommandCenter;
