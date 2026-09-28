import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Wrench,
  Briefcase,
  Award,
  BookOpen,
  Mail,
  CheckCircle,
  XCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import {
  projectsApi,
  skillsApi,
  experiencesApi,
  certificatesApi,
  learningApi,
  contactApi,
  authApi
} from '../../api';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import './DashboardHome.css';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    experiencesCount: 0,
    certificatesCount: 0,
    learningCount: 0,
    contactsCount: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [apiMessage, setApiMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      // 1. Health Ping
      try {
        const pingRes = await authApi.checkHello();
        setApiStatus('online');
        setApiMessage(pingRes.data || 'Welcome to Raj Pandya Portfolio');
      } catch (err) {
        setApiStatus('offline');
        setApiMessage('Unable to reach Spring Boot API (/api/hello)');
      }

      // 2. Resource Counts & Contacts
      try {
        const [proj, skills, exp, cert, learn, contacts] = await Promise.allSettled([
          projectsApi.getAll(),
          skillsApi.getAll(),
          experiencesApi.getAll(),
          certificatesApi.getAll(),
          learningApi.getAll(),
          contactApi.getAll()
        ]);

        const contactList = contacts.status === 'fulfilled' ? contacts.value?.data || [] : [];

        setStats({
          projectsCount: proj.status === 'fulfilled' ? proj.value?.data?.length || 0 : 0,
          skillsCount: skills.status === 'fulfilled' ? skills.value?.data?.length || 0 : 0,
          experiencesCount: exp.status === 'fulfilled' ? exp.value?.data?.length || 0 : 0,
          certificatesCount: cert.status === 'fulfilled' ? cert.value?.data?.length || 0 : 0,
          learningCount: learn.status === 'fulfilled' ? learn.value?.data?.length || 0 : 0,
          contactsCount: contactList.length
        });

        // Top 5 contacts
        setRecentContacts([...contactList].reverse().slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard counts', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    { title: 'Projects', count: stats.projectsCount, icon: <FolderGit2 size={24} />, to: '/admin/projects' },
    { title: 'Skills', count: stats.skillsCount, icon: <Wrench size={24} />, to: '/admin/skills' },
    { title: 'Experiences', count: stats.experiencesCount, icon: <Briefcase size={24} />, to: '/admin/experiences' },
    { title: 'Certificates', count: stats.certificatesCount, icon: <Award size={24} />, to: '/admin/certificates' },
    { title: 'Learning Items', count: stats.learningCount, icon: <BookOpen size={24} />, to: '/admin/learning' },
    { title: 'Contact Messages', count: stats.contactsCount, icon: <Mail size={24} />, to: '/admin/contacts' },
  ];

  return (
    <div className="dashboard-home">
      {/* Backend API status bar */}
      <div className={`api-status-banner status-${apiStatus}`}>
        <div className="api-status-left">
          <Activity size={20} className="status-pulse-icon" />
          <div>
            <span className="status-label">Backend API Status: </span>
            <strong>{apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking...'}</strong>
            <span className="status-subtext"> — {apiMessage}</span>
          </div>
        </div>
        <Badge variant={apiStatus === 'online' ? 'success' : apiStatus === 'offline' ? 'danger' : 'neutral'}>
          {apiStatus.toUpperCase()}
        </Badge>
      </div>

      {/* Metric Cards Grid */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <Link key={card.title} to={card.to} className="stat-card">
            <div className="stat-card-header">
              <span className="stat-title">{card.title}</span>
              <span className="stat-icon">{card.icon}</span>
            </div>
            <div className="stat-count">{loading ? '...' : card.count}</div>
            <div className="stat-view-link">
              <span>Manage {card.title}</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Latest 5 Contacts Inbox */}
      <div className="dashboard-inbox-section">
        <div className="inbox-header">
          <h2 className="inbox-title">Recent Contact Messages</h2>
          <Link to="/admin/contacts" className="view-all-link">
            <span>View All ({stats.contactsCount})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentContacts.length === 0 ? (
          <div className="empty-contacts-card">
            <p>No contact inquiries received yet.</p>
          </div>
        ) : (
          <div className="recent-contacts-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="font-semibold">{contact.name}</td>
                    <td>
                      <a href={`mailto:${contact.email}`} className="table-email-link">
                        {contact.email}
                      </a>
                    </td>
                    <td>{contact.subject || '—'}</td>
                    <td className="table-preview-cell">
                      {contact.message?.length > 70
                        ? `${contact.message.substring(0, 70)}...`
                        : contact.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
