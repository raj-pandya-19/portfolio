import React from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { MapPin, Mail, Phone, ExternalLink, Download } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import './About.css';

export default function About({ about }) {
  if (!about) return null;

  const resolvedResume = resolveMediaUrl(about.resumeUrl);

  return (
    <section id="about" className="about-section section-padding">
      <div className="container">
        <SectionHeading title="About Me" subtitle="Discover My Background" />

        <div className="about-grid">
          <div className="about-bio-card">
            <h3 className="about-bio-title">Transforming ideas into scalable code</h3>
            <div className="about-bio-text">
              {about.fullDescription ? (
                about.fullDescription.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>
                  I am a passionate software engineer dedicated to building resilient distributed systems and intuitive,
                  user-centered web applications. I focus on clean code architecture, performance optimization, and
                  continuous learning.
                </p>
              )}
            </div>

            {resolvedResume && (
              <div className="about-resume-cta">
                <a href={resolvedResume} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" icon={<Download size={16} />}>
                    Download Full CV / Resume
                  </Button>
                </a>
              </div>
            )}
          </div>

          <div className="about-details-card">
            <h4 className="about-details-title">Quick Information</h4>
            <div className="about-info-rows">
              {about.location && (
                <div className="info-row">
                  <span className="info-icon"><MapPin size={18} /></span>
                  <div>
                    <span className="info-label">Location</span>
                    <p className="info-val">{about.location}</p>
                  </div>
                </div>
              )}

              {about.email && (
                <div className="info-row">
                  <span className="info-icon"><Mail size={18} /></span>
                  <div>
                    <span className="info-label">Email</span>
                    <a href={`mailto:${about.email}`} className="info-val link-val">
                      {about.email}
                    </a>
                  </div>
                </div>
              )}

              {about.phone && (
                <div className="info-row">
                  <span className="info-icon"><Phone size={18} /></span>
                  <div>
                    <span className="info-label">Phone</span>
                    <a href={`tel:${about.phone}`} className="info-val link-val">
                      {about.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="about-links-stack">
              {about.githubUrl && (
                <a
                  href={about.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-external-link"
                >
                  <span>GitHub Profile</span>
                  <ExternalLink size={14} />
                </a>
              )}
              {about.linkedinUrl && (
                <a
                  href={about.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-external-link"
                >
                  <span>LinkedIn Network</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
