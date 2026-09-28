import React from 'react';
import './Skeleton.css';

export function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="180px" borderRadius="var(--radius-md) var(--radius-md) 0 0" />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Skeleton width="60%" height="24px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <Skeleton width="50px" height="24px" borderRadius="var(--radius-full)" />
          <Skeleton width="50px" height="24px" borderRadius="var(--radius-full)" />
          <Skeleton width="50px" height="24px" borderRadius="var(--radius-full)" />
        </div>
      </div>
    </div>
  );
}
