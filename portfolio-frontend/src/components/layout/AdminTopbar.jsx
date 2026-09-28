import React from 'react';
import { Menu, LogOut, ExternalLink } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import './AdminTopbar.css';

export default function AdminTopbar({ title = 'Dashboard', onToggleSidebar }) {
  const { logout } = useAuth();

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <a href="/" target="_blank" rel="noopener noreferrer" className="topbar-icon-btn" title="View live site">
          <ExternalLink size={18} />
        </a>
        <ThemeToggle />
        <button
          type="button"
          className="topbar-icon-btn topbar-logout-btn"
          onClick={logout}
          title="Sign out"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
