/* ==============================================
   Skeleton Loader Component
   ============================================== */
import React from 'react';
import { clsx } from 'clsx';
import './Skeleton.css';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  circle = false,
}) => {
  return (
    <span
      className={clsx('skeleton', circle && 'skeleton-circle', className)}
      style={{
        ...(width && { width }),
        ...(height && { height }),
      }}
      aria-hidden="true"
    />
  );
};

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonProjectCard: React.FC<SkeletonCardProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card-header">
            <Skeleton className="skeleton-title" />
            <Skeleton className="skeleton-badge" />
          </div>
          <Skeleton className="skeleton-desc" />
          <Skeleton className="skeleton-desc-short" />
          <div className="skeleton-progress-section">
            <div className="skeleton-progress-header">
              <Skeleton className="skeleton-label" />
              <Skeleton className="skeleton-label" />
            </div>
            <Skeleton className="skeleton-progress-bar" />
          </div>
          <div className="skeleton-card-footer">
            <div className="skeleton-avatars">
              <Skeleton circle width="24px" height="24px" />
              <Skeleton circle width="24px" height="24px" />
              <Skeleton circle width="24px" height="24px" />
            </div>
            <Skeleton className="skeleton-stat" />
          </div>
          <Skeleton className="skeleton-btn" />
        </div>
      ))}
    </>
  );
};
