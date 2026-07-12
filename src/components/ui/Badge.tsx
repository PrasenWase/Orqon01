import React from 'react';
import { clsx } from 'clsx';
import './Badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'healthy' | 'at-risk' | 'delayed' | 'default' | 'ai';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)} {...props}>
      {children}
    </span>
  );
};
