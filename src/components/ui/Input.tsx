import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substr(2, 9);

    return (
      <div className={clsx('input-wrapper', className)}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'input-field',
              leftIcon && 'has-left-icon',
              rightIcon && 'has-right-icon',
              error && 'input-error'
            )}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
        </div>
        {error && <span className="input-error-text" role="alert">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
