import React, { useState } from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import MediaImage from '../../../components/shared/MediaImage';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { sortByDisplayOrder } from '../../../utils/formatters';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Github } from '../../../components/shared/SocialIcons';
import './Projects.css';

export default function Projects({ projects = [] }) {
  const [expandedCards, setExpandedCards] = useState({});

  // Public site must only show published=true
  const publishedProjects = sortByDisplayOrder(
    projects.filter((p) => p.published !== false)
  );

  if (publishedProjects.length === 0) return null;

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="projects" className="projects-section section-padding">
      <div className="container">
        <SectionHeading title="Featured Projects" subtitle="Code In Action & Live Systems" />

        <div className="projects-grid">
          {publishedProjects.map((project) => {
            const isExpanded = !!expandedCards[project.id];
            const techList = project.technologies
              ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
              : [];
            const visibleTech = techList.slice(0, 5);
            const remainingCount = techList.length - 5;

            return (
              <div key={project.id} className="project-card reveal-item in-view">
                <div className="project-cover-wrap">
                  <MediaImage
                    src={project.imageUrl}
                    alt={project.title}
                    className="project-cover-img"
                  />
                </div>

                <div className="project-body">
                  <h3 className="project-title">{project.title}</h3>

                  <div className={`project-desc ${isExpanded ? 'expanded' : 'clamped'}`}>
                    {project.description}
                  </div>

                  {project.description && project.description.length > 130 && (
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => toggleExpand(project.id)}
                    >
                      {isExpanded ? (
                        <>Show less <ChevronUp size={14} /></>
                      ) : (
                        <>Read more <ChevronDown size={14} /></>
                      )}
                    </button>
                  )}

                  {techList.length > 0 && (
                    <div className="project-tech-chips">
                      {visibleTech.map((tech) => (
                        <Badge key={tech} variant="neutral" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {remainingCount > 0 && (
                        <Badge variant="accent" size="sm">
                          +{remainingCount}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="project-footer">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link"
                      >
                        <Button variant="secondary" size="sm" icon={<Github size={16} />}>
                          Source
                        </Button>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link"
                      >
                        <Button variant="primary" size="sm" icon={<ExternalLink size={16} />}>
                          Live Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
