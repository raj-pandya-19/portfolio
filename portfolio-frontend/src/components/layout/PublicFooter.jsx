import React from 'react';
import { Globe, Heart } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram } from '../shared/SocialIcons';
import './PublicFooter.css';

export default function PublicFooter({ about, socialLinks = [] }) {
  const currentYear = new Date().getFullYear();

  const getPlatformIcon = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={20} />;
    if (p.includes('instagram')) return <Instagram size={20} />;
    return <Globe size={20} />;
  };

  const visibleSocials = socialLinks.filter((s) => s.visible !== false);

  return (
    <footer className="public-footer">
      <div className="container footer-content">
        <div className="footer-brand-col">
          <span className="footer-brand">Raj<span className="brand-dot">.</span></span>
          <p className="footer-tagline">
            {about?.title || 'Software Engineer'} crafting high-performance web applications and backend systems.
          </p>
        </div>

        <div className="footer-links-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-nav-list">
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-social-col">
          <h4 className="footer-col-title">Connect</h4>
          <div className="footer-social-links">
            {visibleSocials.map((social) => (
              <a
                key={social.id || social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label={social.platform}
                title={social.platform}
              >
                {getPlatformIcon(social.platform)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copy">
          © {currentYear} Raj Pandya. Built with React & Spring Boot.
        </p>
        <a href="/admin/login" className="admin-portal-link">
          Admin Portal
        </a>
      </div>
    </footer>
  );
}
