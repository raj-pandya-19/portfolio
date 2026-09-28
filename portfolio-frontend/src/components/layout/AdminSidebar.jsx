import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  FolderGit2,
  Share2,
  FolderOpen,
  Mail,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { label: 'Overview', to: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'About', to: '/admin/about', icon: <User size={18} /> },
    { label: 'Skills', to: '/admin/skills', icon: <Wrench size={18} /> },
    { label: 'Experiences', to: '/admin/experiences', icon: <Briefcase size={18} /> },
    { label: 'Education', to: '/admin/education', icon: <GraduationCap size={18} /> },
    { label: 'Certificates', to: '/admin/certificates', icon: <Award size={18} /> },
    { label: 'Training', to: '/admin/training', icon: <Award size={18} /> },
    { label: 'Learning Roadmap', to: '/admin/learning', icon: <BookOpen size={18} /> },
    { label: 'Projects', to: '/admin/projects', icon: <FolderGit2 size={18} /> },
    { label: 'Social Links', to: '/admin/social-links', icon: <Share2 size={18} /> },
    { label: 'Media Library', to: '/admin/media', icon: <FolderOpen size={18} /> },
    { label: 'Contacts Inbox', to: '/admin/contacts', icon: <Mail size={18} /> },
  ];

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-text">Portfolio Admin</span>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => onClose && onClose()}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="sidebar-link view-site-link">
            <span className="sidebar-icon"><ExternalLink size={18} /></span>
            <span className="sidebar-label">View Live Site</span>
          </a>
          <button type="button" className="sidebar-link logout-btn" onClick={logout}>
            <span className="sidebar-icon"><LogOut size={18} /></span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}
