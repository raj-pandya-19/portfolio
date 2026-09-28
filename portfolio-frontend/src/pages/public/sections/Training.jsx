import React from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { sortByDisplayOrder, formatDate } from '../../../utils/formatters';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import { BookOpen, Calendar, MapPin, ExternalLink } from 'lucide-react';
import '../sections/Experience.css';

export default function Training({ training = [] }) {
  const sortedTraining = sortByDisplayOrder(training);

  if (sortedTraining.length === 0) return null;

  return (
    <section id="training" className="training-section section-padding">
      <div className="container">
        <SectionHeading title="Workshops & Training" subtitle="Continuous Professional Development" />

        <div className="timeline-wrapper">
          <div className="timeline-line" />

          {sortedTraining.map((item) => {
            const certUrl = resolveMediaUrl(item.certificateUrl);

            return (
              <div key={item.id} className="timeline-item reveal-item in-view">
                <div className="timeline-dot">
                  <BookOpen size={14} />
                </div>

                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div>
                      <h3 className="timeline-role">{item.title}</h3>
                      <h4 className="timeline-company">{item.organization}</h4>
                    </div>

                    <div className="timeline-date-pill">
                      <Calendar size={13} />
                      <span>
                        {formatDate(item.startDate)} –{' '}
                        {item.current ? (
                          <span className="current-text">Present</span>
                        ) : (
                          formatDate(item.endDate)
                        )}
                      </span>
                    </div>
                  </div>

                  {item.location && (
                    <div className="timeline-location">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                  )}

                  <div className="timeline-desc">
                    {item.description}
                  </div>

                  {certUrl && (
                    <div style={{ marginTop: 'var(--space-2)' }}>
                      <a
                        href={certUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.8125rem',
                          color: 'var(--color-accent)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>View Training Certificate</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
