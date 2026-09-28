import React, { useState } from 'react';
import SectionHeading from '../../../components/shared/SectionHeading';
import { Input, TextArea } from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { contactApi } from '../../../api';
import { validateContactForm } from '../../../utils/validators';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import './Contact.css';

export default function Contact({ about }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validation mirroring Part A rules
    const errors = validateContactForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await contactApi.send(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setIsSubmitting(false);
      // Backend returns { message: "...", error: "...", status: 400 }
      const backendMsg = err?.message || err?.error || 'Failed to send message. Please try again.';
      setServerError(backendMsg);
    }
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <SectionHeading title="Get In Touch" subtitle="Let's Discuss Projects Or Opportunities" />

        <div className="contact-grid">
          {/* Left: Contact Info */}
          <div className="contact-info-col reveal-item in-view">
            <h3 className="contact-info-title">Have a project in mind?</h3>
            <p className="contact-info-desc">
              Whether you need backend architecture, full-stack engineering, or cloud deployment,
              feel free to reach out. I will get back to you as soon as possible.
            </p>

            <div className="contact-cards-list">
              {about?.email && (
                <div className="contact-detail-card">
                  <div className="contact-detail-icon"><Mail size={20} /></div>
                  <div>
                    <span className="contact-detail-label">Email Me</span>
                    <a href={`mailto:${about.email}`} className="contact-detail-value">
                      {about.email}
                    </a>
                  </div>
                </div>
              )}

              {about?.phone && (
                <div className="contact-detail-card">
                  <div className="contact-detail-icon"><Phone size={20} /></div>
                  <div>
                    <span className="contact-detail-label">Call / WhatsApp</span>
                    <a href={`tel:${about.phone}`} className="contact-detail-value">
                      {about.phone}
                    </a>
                  </div>
                </div>
              )}

              {about?.location && (
                <div className="contact-detail-card">
                  <div className="contact-detail-icon"><MapPin size={20} /></div>
                  <div>
                    <span className="contact-detail-label">Location</span>
                    <span className="contact-detail-value">{about.location}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-card reveal-item in-view">
            {isSuccess ? (
              <div className="contact-success-state">
                <CheckCircle2 size={48} className="success-icon" />
                <h3 className="success-title">Message Sent Successfully!</h3>
                <p className="success-desc">
                  Thank you for reaching out. Your message has been received and I'll respond shortly.
                </p>
                <Button variant="secondary" onClick={() => setIsSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {serverError && (
                  <div className="server-error-banner" role="alert">
                    <AlertCircle size={18} />
                    <span>{serverError}</span>
                  </div>
                )}

                <Input
                  label="Your Name"
                  id="contact-name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  required
                />

                <Input
                  label="Your Email"
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  required
                />

                <Input
                  label="Subject"
                  id="contact-subject"
                  name="subject"
                  placeholder="Project Collaboration"
                  value={formData.subject}
                  onChange={handleChange}
                />

                <TextArea
                  label="Your Message"
                  id="contact-message"
                  name="message"
                  placeholder="Write your message here (min 10 characters)..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  error={fieldErrors.message}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  icon={<Send size={18} />}
                  style={{ width: '100%', marginTop: 'var(--space-2)' }}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
