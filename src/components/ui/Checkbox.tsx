import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import './Checkbox.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || Math.random().toString(36).substr(2, 9);

    return (
      <div className={clsx('checkbox-wrapper', className)}>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={clsx('checkbox-input', error && 'checkbox-error')}
            aria-invalid={!!error}
            {...props}
          />
          {label && (
            <label htmlFor={checkboxId} className="checkbox-label">
              {label}
            </label>
          )}
        </div>
        {error && <span className="checkbox-error-text" role="alert">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
