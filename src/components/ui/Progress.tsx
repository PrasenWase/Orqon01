import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import './Progress.css';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'healthy' | 'at-risk' | 'delayed' | 'completed' | 'default';
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  variant = 'default',
  showLabel = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx('progress-wrapper', className)}>
      {showLabel && (
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-value">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="progress-bar-bg">
        <motion.div
          className={clsx('progress-bar-fill', `progress-${variant}`)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
