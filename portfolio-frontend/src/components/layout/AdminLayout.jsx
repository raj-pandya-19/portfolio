import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import './AdminLayout.css';

export default function AdminLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main-wrap">
        <AdminTopbar title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
