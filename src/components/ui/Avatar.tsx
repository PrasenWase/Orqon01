import React from 'react';
import { clsx } from 'clsx';
import './Avatar.css';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = 'md', className, alt = '', ...props }) => {
  const [error, setError] = React.useState(false);

  return (
    <div className={clsx('avatar', `avatar-${size}`, className)}>
      {!error && src ? (
        <img 
          src={src} 
          alt={alt} 
          className="avatar-img" 
          onError={() => setError(true)} 
          {...props} 
        />
      ) : (
        <span className="avatar-fallback">{fallback || alt?.charAt(0) || '?'}</span>
      )}
    </div>
  );
};

export const AvatarGroup: React.FC<{ children: React.ReactNode; max?: number }> = ({ children, max }) => {
  const childrenArray = React.Children.toArray(children);
  const showCount = max ? childrenArray.length > max : false;
  const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;

  return (
    <div className="avatar-group">
      {visibleChildren}
      {showCount && (
        <div className="avatar avatar-sm avatar-overflow">
          +{childrenArray.length - max!}
        </div>
      )}
    </div>
  );
};
