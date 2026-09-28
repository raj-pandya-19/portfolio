import React, { useEffect, useState } from 'react';
import { contactApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { Mail, Calendar, User, MessageSquare, Search } from 'lucide-react';
import './ContactsInbox.css';

export default function ContactsInbox() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await contactApi.getAll();
      setMessages(res.data || []);
    } catch (err) {
      addToast('Failed to load contact messages', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredMessages = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.subject?.toLowerCase().includes(term) ||
      m.message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="contacts-inbox-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Contacts Inbox</h2>
          <p className="admin-page-subtitle">Read-only repository of visitor inquiries and messages (GET /api/contact)</p>
        </div>

        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search messages by name, email, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message Excerpt</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  {searchTerm ? 'No messages match your search criteria.' : 'No contact inquiries received yet.'}
                </td>
              </tr>
            ) : (
              filteredMessages.map((msg) => (
                <tr key={msg.id} onClick={() => setActiveMessage(msg)} style={{ cursor: 'pointer' }}>
                  <td className="font-semibold">{msg.name}</td>
                  <td>
                    <a
                      href={`mailto:${msg.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="table-email-link"
                    >
                      {msg.email}
                    </a>
                  </td>
                  <td>{msg.subject || '—'}</td>
                  <td className="table-preview-cell">
                    {msg.message?.length > 75 ? `${msg.message.substring(0, 75)}...` : msg.message}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant="ghost" size="sm" onClick={() => setActiveMessage(msg)}>
                      View Full
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Message Reader Modal */}
      <Modal
        isOpen={!!activeMessage}
        onClose={() => setActiveMessage(null)}
        title="Contact Message Details"
        maxWidth="560px"
      >
        {activeMessage && (
          <div className="contact-reader-body">
            <div className="reader-meta-group">
              <div className="reader-meta-item">
                <span className="reader-meta-label">Sender Name:</span>
                <span className="reader-meta-val font-semibold">{activeMessage.name}</span>
              </div>
              <div className="reader-meta-item">
                <span className="reader-meta-label">Email Address:</span>
                <a href={`mailto:${activeMessage.email}`} className="table-email-link">
                  {activeMessage.email}
                </a>
              </div>
              {activeMessage.subject && (
                <div className="reader-meta-item">
                  <span className="reader-meta-label">Subject:</span>
                  <span className="reader-meta-val">{activeMessage.subject}</span>
                </div>
              )}
            </div>

            <div className="reader-message-content">
              <label className="reader-message-label">Full Message:</label>
              <div className="reader-message-box">
                {activeMessage.message}
              </div>
            </div>

            <div className="reader-footer-actions">
              <a href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Your inquiry')}`}>
                <Button variant="primary" icon={<Mail size={16} />}>
                  Reply via Email
                </Button>
              </a>
              <Button variant="secondary" onClick={() => setActiveMessage(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
