import React, { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';
import Button from '../ui/Button';
import { resolveMediaUrl } from '../../utils/resolveMediaUrl';
import './PublicNavbar.css';

export default function PublicNavbar({ resumeUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    // { label: 'Experience', href: '#experience' },t
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    // { label: 'Certificates', href: '#certificates' },
    { label: 'Training', href: '#training' },
    { label: 'Learning', href: '#learning' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = [
      'hero',
      'about',
      'skills',
      'experience',
      'education',
      'projects',
      'certificates',
      'training',
      'learning',
      'contact',
    ];

    const handleSectionObserver = () => {
      const scrollPos = window.scrollY + 100;

      for (const id of sectionIds) {
        const el = document.getElementById(id);

        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleSectionObserver);

    return () => window.removeEventListener('scroll', handleSectionObserver);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resolvedResume = resolveMediaUrl(resumeUrl);

  return (
    <header className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="#hero" className="navbar-brand">
          Raj<span className="brand-dot">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="navbar-links" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link ${
                activeSection === link.href.replace('#', '') ? 'active' : ''
              }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <ThemeToggle />

          {resolvedResume && (
            <a
              href={resolvedResume}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-resume-link"
            >
              <Button size="sm" icon={<FileText size={16} />}>
                Resume
              </Button>
            </a>
          )}

          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="navbar-brand">
            Raj<span className="brand-dot">.</span>
          </span>

          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`mobile-nav-link ${
                activeSection === link.href.replace('#', '') ? 'active' : ''
              }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}

          {resolvedResume && (
            <a
              href={resolvedResume}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-resume-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                style={{ width: '100%' }}
                icon={<FileText size={16} />}
              >
                Download Resume
              </Button>
            </a>
          )}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}