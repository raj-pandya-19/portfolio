import React from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { sortByDisplayOrder, formatDate } from '../../../utils/formatters';
import { GraduationCap, MapPin, Calendar, Award } from 'lucide-react';
import '../sections/Experience.css';

export default function EducationSection({ education = [] }) {
  const sortedEducation = sortByDisplayOrder(education);

  if (sortedEducation.length === 0) return null;

  return (
    <section id="education" className="education-section section-padding">
      <div className="container">
        <SectionHeading title="Education" subtitle="Academic Qualifications & Background" />

        <div className="timeline-wrapper">
          <div className="timeline-line" />

          {sortedEducation.map((edu) => (
            <div key={edu.id} className="timeline-item reveal-item in-view">
              <div className="timeline-dot">
                <GraduationCap size={14} />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-header">
                  <div>
                    <h3 className="timeline-role">{edu.degree}</h3>
                    <h4 className="timeline-company">{edu.institution}</h4>
                    {edu.fieldOfStudy && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        Field: {edu.fieldOfStudy}
                      </p>
                    )}
                  </div>

                  <div className="timeline-date-pill">
                    <Calendar size={13} />
                    <span>
                      {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  {edu.location && (
                    <div className="timeline-location">
                      <MapPin size={14} />
                      <span>{edu.location}</span>
                    </div>
                  )}
                  {edu.grade && (
                    <div className="timeline-location">
                      <Award size={14} />
                      <span>Grade: {edu.grade}</span>
                    </div>
                  )}
                </div>

                {edu.description && (
                  <div className="timeline-desc">
                    {edu.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
