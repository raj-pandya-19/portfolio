import React from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { Badge } from '../../../components/ui/Badge';
import { sortByDisplayOrder, formatDate } from '../../../utils/formatters';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import './Experience.css';

export default function Experience({ experiences = [] }) {
  const sortedExperiences = sortByDisplayOrder(experiences);

  if (sortedExperiences.length === 0) return null;

  return (
    <section id="experience" className="experience-section section-padding">
      <div className="container">
        <SectionHeading title="Work Experience" subtitle="My Professional Career Journey" />

        <div className="timeline-wrapper">
          <div className="timeline-line" />

          {sortedExperiences.map((exp) => {
            const techList = exp.technologies
              ? exp.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <div key={exp.id} className="timeline-item reveal-item in-view">
                <div className="timeline-dot">
                  <Briefcase size={14} />
                </div>

                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div>
                      <h3 className="timeline-role">{exp.role}</h3>
                      <h4 className="timeline-company">{exp.company}</h4>
                    </div>

                    <div className="timeline-date-pill">
                      <Calendar size={13} />
                      <span>
                        {formatDate(exp.startDate)} –{' '}
                        {exp.current ? (
                          <span className="current-text">Present</span>
                        ) : (
                          formatDate(exp.endDate)
                        )}
                      </span>
                    </div>
                  </div>

                  {exp.location && (
                    <div className="timeline-location">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  )}

                  <div className="timeline-desc">
                    {exp.description}
                  </div>

                  {techList.length > 0 && (
                    <div className="timeline-tech-stack">
                      {techList.map((tech) => (
                        <Badge key={tech} variant="neutral" size="sm">
                          {tech}
                        </Badge>
                      ))}
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
