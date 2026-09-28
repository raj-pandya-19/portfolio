import React from 'react';
import './Badge.css';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  // variant: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}
