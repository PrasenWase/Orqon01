import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
      <header>
        {/* Public Header */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
