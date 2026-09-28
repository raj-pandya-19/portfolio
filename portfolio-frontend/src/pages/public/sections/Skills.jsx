import React, { useEffect, useRef } from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import { sortByDisplayOrder } from '../../../utils/formatters';
import { Sparkles } from 'lucide-react';
import './Skills.css';

export default function Skills({ skills = [] }) {
  const containerRef = useRef(null);

  const sortedSkills = sortByDisplayOrder(skills);
  const featuredSkills = sortedSkills.filter((s) => s.featured);

  // Group by category
  const categories = Array.from(new Set(sortedSkills.map((s) => s.category || 'General')));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    const bars = containerRef.current?.querySelectorAll('.skill-bar-fill');
    bars?.forEach((bar) => observer.observe(bar));

    return () => observer.disconnect();
  }, [skills]);

  return (
    <section id="skills" className="skills-section section-padding" ref={containerRef}>
      <div className="container">
        <SectionHeading title="Technical Skills" subtitle="My Capabilities & Core Stack" />

        {/* Featured Skills Quick Strip */}
        {featuredSkills.length > 0 && (
          <div className="featured-skills-strip">
            <div className="featured-badge-header">
              <Sparkles size={16} />
              <span>Core Specializations</span>
            </div>
            <div className="featured-pills-list">
              {featuredSkills.map((skill) => {
                const icon = resolveMediaUrl(skill.iconUrl);
                return (
                  <div key={skill.id} className="featured-pill">
                    {icon && <img src={icon} alt={skill.name} className="skill-pill-icon" />}
                    <span className="skill-pill-name">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grouped Skills */}
        <div className="skills-categories-grid">
          {categories.map((category) => {
            const catSkills = sortedSkills.filter((s) => (s.category || 'General') === category);
            return (
              <div key={category} className="skill-category-card">
                <h3 className="category-card-title">{category}</h3>
                <div className="category-skills-list">
                  {catSkills.map((skill) => {
                    const icon = resolveMediaUrl(skill.iconUrl);
                    const prof = Math.min(100, Math.max(0, skill.proficiency || 0));

                    return (
                      <div key={skill.id} className="skill-item">
                        <div className="skill-meta">
                          <div className="skill-meta-left">
                            {icon && <img src={icon} alt="" className="skill-small-icon" />}
                            <span className="skill-name">{skill.name}</span>
                          </div>
                          <span className="skill-pct">{prof}%</span>
                        </div>
                        <div className="skill-bar-track">
                          <div
                            className="skill-bar-fill"
                            style={{ '--target-width': `${prof}%` }}
                            role="progressbar"
                            aria-valuenow={prof}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
