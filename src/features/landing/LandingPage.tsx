import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Manage projects smarter with <span>Orqon AI</span>
          </h1>

          <p>
            A modern workspace for teams, managers, and clients to track tasks,
            collaborate, and optimize workflows with AI-powered insights.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate('/login')}>Get Started</button>
            <button className="secondary-btn" onClick={() => navigate('/dashboard')}>View Demo</button>
          </div>
        </div>

        <div className="hero-dashboard">
          <div className="dashboard-card">
            <h3>Orqon Dashboard</h3>
            <p>Projects • Tasks • AI Actions</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything your team needs</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Smart Task Management</h3>
            <p>
              Assign tasks, track progress, and keep everyone aligned.
            </p>
          </div>

          <div className="feature-card">
            <h3>Orqon AI</h3>
            <p>
              Get intelligent recommendations and workflow improvements.
            </p>
          </div>

          <div className="feature-card">
            <h3>Client Visibility</h3>
            <p>
              Give clients transparent project progress updates.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;

