import React, { useEffect, useState } from 'react';
import { aboutApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FileUploadField from '../../components/shared/FileUploadField';
import { validateRequired, validateEmail } from '../../utils/validators';
import { Save, AlertCircle } from 'lucide-react';
import './AboutAdmin.css';

export default function AboutAdmin() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutId, setAboutId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    profileImageUrl: '',
    location: '',
    email: '',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    resumeUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await aboutApi.getAll();
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data) {
          setAboutId(data.id);
          setFormData({
            title: data.title || '',
            shortDescription: data.shortDescription || '',
            fullDescription: data.fullDescription || '',
            profileImageUrl: data.profileImageUrl || '',
            location: data.location || '',
            email: data.email || '',
            phone: data.phone || '',
            githubUrl: data.githubUrl || '',
            linkedinUrl: data.linkedinUrl || '',
            resumeUrl: data.resumeUrl || ''
          });
        }
      } catch (err) {
        addToast('Failed to load About record', 'danger');
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, [addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Client-side validations
    const newErrors = {};
    const titleErr = validateRequired(formData.title, 'Title');
    if (titleErr) newErrors.title = titleErr;

    if (formData.email) {
      const emailErr = validateEmail(formData.email);
      if (emailErr) newErrors.email = emailErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please fix the validation errors in the form', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (aboutId) {
        await aboutApi.update(aboutId, formData);
        addToast('About information updated successfully!', 'success');
      } else {
        const createRes = await aboutApi.create(formData);
        if (createRes.data?.id) setAboutId(createRes.data.id);
        addToast('About information created successfully!', 'success');
      }
    } catch (err) {
      const msg = err?.message || err?.error || 'Failed to save About information';
      setServerError(msg);
      addToast(msg, 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading-state">Loading About record...</div>;
  }

  return (
    <div className="about-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage About Profile</h2>
          <p className="admin-page-subtitle">Configure your core profile, bio, resume, and contact channels</p>
        </div>
      </div>

      {serverError && (
        <div className="server-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="about-admin-form">
        <div className="about-form-grid">
          {/* Main Info */}
          <div className="admin-form-card">
            <h3 className="card-section-title">Professional Identity</h3>
            <Input
              label="Professional Title"
              name="title"
              placeholder="Full Stack Software Engineer"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              required
            />
            <Input
              label="Short Hook / Eyebrow Description"
              name="shortDescription"
              placeholder="Passionate engineer crafting scalable web apps..."
              value={formData.shortDescription}
              onChange={handleChange}
            />
            <TextArea
              label="Full Biography"
              name="fullDescription"
              placeholder="Detailed background, engineering philosophy, and experience..."
              rows={8}
              value={formData.fullDescription}
              onChange={handleChange}
            />
          </div>

          {/* Media & Uploads */}
          <div className="admin-form-card">
            <h3 className="card-section-title">Media & Resume</h3>
            <FileUploadField
              label="Profile Photo"
              endpointType="image"
              value={formData.profileImageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, profileImageUrl: url }))}
              helperText="JPG, PNG, or WEBP (Max 5MB)"
            />

            <FileUploadField
              label="Curriculum Vitae / Resume"
              endpointType="resume"
              value={formData.resumeUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, resumeUrl: url }))}
              helperText="PDF document (Max 10MB)"
            />
          </div>

          {/* Contact Details & Links */}
          <div className="admin-form-card full-width">
            <h3 className="card-section-title">Location & Contact Details</h3>
            <div className="two-col-inputs">
              <Input
                label="Location"
                name="location"
                placeholder="San Francisco, CA or Remote"
                value={formData.location}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="raj@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                label="GitHub URL"
                name="githubUrl"
                placeholder="https://github.com/rajpandya"
                value={formData.githubUrl}
                onChange={handleChange}
              />
              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/rajpandya"
                value={formData.linkedinUrl}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="admin-form-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={saving}
            icon={<Save size={18} />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
