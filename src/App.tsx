import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy load features
const LandingPage = React.lazy(() => import('./features/landing/LandingPage'));
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const Dashboard = React.lazy(() => import('./features/dashboard/Dashboard'));
const ProjectsList = React.lazy(() => import('./features/projects/ProjectsList'));
const ProjectOverview = React.lazy(() => import('./features/projects/ProjectOverview'));
const TaskDetails = React.lazy(() => import('./features/tasks/TaskDetails'));
const Discussion = React.lazy(() => import('./features/discussion/Discussion'));
const FilesAndDeliverables = React.lazy(() => import('./features/files/FilesAndDeliverables'));
const Notifications = React.lazy(() => import('./features/notifications/Notifications'));
const ClientPortal = React.lazy(() => import('./features/client-portal/ClientPortal'));
const Settings = React.lazy(() => import('./features/settings/Settings'));
const CommandCenter = React.lazy(() => import('./features/command-center/CommandCenter'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--color-text-primary)' }}>
    Loading...
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Authenticated Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/projects/:projectId" element={<ProjectOverview />} />
            <Route path="/tasks/:taskId" element={<TaskDetails />} />
            <Route path="/projects/:projectId/discussion" element={<Discussion />} />
            <Route path="/projects/:projectId/files" element={<FilesAndDeliverables />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/client" element={<ClientPortal />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai" element={<CommandCenter />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
