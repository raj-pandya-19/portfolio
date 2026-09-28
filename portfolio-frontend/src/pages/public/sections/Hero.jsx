import React from 'react';
import { ArrowRight, Mail, Globe } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram } from '../../../components/shared/SocialIcons';
import Button from '../../../components/ui/Button';
import { resolveMediaUrl } from '../../../utils/resolveMediaUrl';
import './Hero.css';

export default function Hero({ about, socialLinks = [] }) {
  const resolvedProfileImg = resolveMediaUrl(about?.profileImageUrl);
  const visibleSocials = socialLinks.filter((s) => s.visible !== false);

  const getPlatformIcon = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={20} />;
    if (p.includes('instagram')) return <Instagram size={20} />;
    return <Globe size={20} />;
  };

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section section-padding">
      <div className="container hero-container">
        <div className="hero-left reveal-item in-view">
          <div className="hero-eyebrow-badge">
            <span className="eyebrow-ping" />
            <span>Available for new opportunities</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="highlight-text">Raj Pandya</span>
          </h1>

          <h2 className="hero-subtitle">
            {about?.title || 'Full Stack Software Engineer'}
          </h2>

          <p className="hero-description">
            {about?.shortDescription ||
              'Passionate developer specializing in building scalable web applications, robust backend microservices, and elegant user interfaces.'}
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleScrollTo('contact')}
              icon={<Mail size={18} />}
            >
              Contact Me
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleScrollTo('projects')}
              icon={<ArrowRight size={18} />}
            >
              View Projects
            </Button>
          </div>

          <div className="hero-socials">
            <span className="hero-socials-label">Follow me:</span>
            <div className="hero-social-icons">
              {visibleSocials.map((social) => (
                <a
                  key={social.id || social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label={social.platform}
                  title={social.platform}
                >
                  {getPlatformIcon(social.platform)}
                </a>
              ))}
              {about?.githubUrl && !visibleSocials.some((s) => s.platform.toLowerCase().includes('github')) && (
                <a
                  href={about.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              )}
              {about?.linkedinUrl && !visibleSocials.some((s) => s.platform.toLowerCase().includes('linkedin')) && (
                <a
                  href={about.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="hero-right reveal-item in-view">
          <div className="hero-image-frame-wrap">
            <div className="hero-accent-blob" />
            <div className="hero-image-frame">
              {resolvedProfileImg ? (
                <img
                  src={resolvedProfileImg}
                  alt={about?.title || 'Raj Pandya'}
                  className="hero-profile-image"
                />
              ) : (
                <div className="hero-profile-placeholder">
                  <span className="profile-placeholder-initials">RP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
