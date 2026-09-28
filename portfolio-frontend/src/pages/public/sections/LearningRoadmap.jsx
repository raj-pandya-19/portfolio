import React from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { Badge } from '../../../components/ui/Badge';
import { sortByDisplayOrder, formatDate } from '../../../utils/formatters';
import { Compass, Calendar, Target } from 'lucide-react';
import './LearningRoadmap.css';

export default function LearningRoadmap({ learning = [] }) {
  // Public site must filter visible=false out
  const visibleItems = sortByDisplayOrder(
    learning.filter((item) => item.visible !== false)
  );

  if (visibleItems.length === 0) return null;

  const getStatusVariant = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'warning';
    if (s.includes('completed') || s.includes('done')) return 'success';
    return 'neutral';
  };

  return (
    <section id="learning" className="learning-section section-padding">
      <div className="container">
        <SectionHeading title="Currently Learning" subtitle="Tech Horizon & Knowledge Roadmap" />

        <div className="learning-grid">
          {visibleItems.map((item) => {
            const statusVariant = getStatusVariant(item.status);

            return (
              <div key={item.id} className="learning-card reveal-item in-view">
                <div className="learning-card-top">
                  <div className="learning-badge-row">
                    <Badge variant={statusVariant} size="sm">
                      {item.status || 'Planned'}
                    </Badge>
                    {item.category && (
                      <span className="learning-cat-label">{item.category}</span>
                    )}
                  </div>
                  <h3 className="learning-title">{item.title}</h3>
                </div>

                <p className="learning-desc">{item.description}</p>

                {(item.startDate || item.targetDate) && (
                  <div className="learning-date-info">
                    {item.startDate && (
                      <div className="learning-date-row">
                        <Calendar size={13} />
                        <span>Started: {formatDate(item.startDate)}</span>
                      </div>
                    )}
                    {item.targetDate && (
                      <div className="learning-date-row target-date">
                        <Target size={13} />
                        <span>Target: {formatDate(item.targetDate)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
