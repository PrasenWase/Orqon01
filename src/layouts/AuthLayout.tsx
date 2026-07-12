import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layers } from 'lucide-react';
import './AuthLayout.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-sidebar">
        <div className="auth-logo">
          <Layers size={32} />
          <span>Orqon</span>
        </div>
        
        <div className="auth-branding-content">
          <h1 className="auth-headline">
            Coordinate<br />projects.<br />Not people.
          </h1>
          <p className="auth-description">
            AI-powered project coordination that automates follow-ups, detects blockers, optimizes schedules, and keeps every stakeholder aligned.
          </p>
        </div>

        <div className="auth-graphic">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Minimalist central circle/lines abstraction from design */}
            <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <rect x="150" y="150" width="100" height="100" rx="12" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
            <path d="M0 200h100M300 200h100M200 0v100M200 300v100" stroke="currentColor" strokeWidth="2" strokeOpacity="0.1" />
            <circle cx="200" cy="100" r="4" fill="currentColor" fillOpacity="0.4" />
            <circle cx="200" cy="300" r="4" fill="currentColor" fillOpacity="0.4" />
            <circle cx="100" cy="200" r="4" fill="currentColor" fillOpacity="0.4" />
            <circle cx="300" cy="200" r="4" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </div>

        <div className="auth-footer">
          ENTERPRISE EDITION V2.4
        </div>
      </div>
      
      <div className="auth-main">
        <div className="auth-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
