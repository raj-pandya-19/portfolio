import React from 'react';
import './SectionHeading.css';

export default function SectionHeading({ title, subtitle, centered = true }) {
  return (
    <div className={`section-heading ${centered ? 'text-center' : ''}`}>
      {subtitle && <span className="section-eyebrow">{subtitle}</span>}
      <h2 className="section-title">{title}</h2>
      <div className="section-title-line" />
    </div>
  );
}
