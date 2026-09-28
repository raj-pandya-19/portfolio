import React, { useEffect, useState } from 'react';
import { socialLinksApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateRequired, validateNumber } from '../../utils/validators';
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  ExternalLink
} from 'lucide-react';
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube
} from '../../components/shared/SocialIcons';

export default function SocialLinksAdmin() {
  const { addToast } = useToast();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    platform: 'GitHub',
    customPlatform: '',
    url: '',
    displayOrder: 0,
    visible: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchSocialLinks = async () => {
    try {
      const res = await socialLinksApi.getAll();
      setLinks(res.data || []);
    } catch (err) {
      addToast('Failed to load social links', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleOpenCreate = () => {
    setEditingLink(null);
    setFormData({ ...initialForm, displayOrder: links.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingLink(item);
    const presets = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Website'];
    const isPreset = presets.includes(item.platform);

    setFormData({
      platform: isPreset ? item.platform : 'Other',
      customPlatform: isPreset ? '' : item.platform,
      url: item.url || '',
      displayOrder: item.displayOrder ?? 0,
      visible: item.visible !== false
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const getPlatformIcon = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={18} />;
    if (p.includes('linkedin')) return <Linkedin size={18} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={18} />;
    if (p.includes('instagram')) return <Instagram size={18} />;
    if (p.includes('youtube')) return <Youtube size={18} />;
    return <Globe size={18} />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalPlatform =
      formData.platform === 'Other' ? formData.customPlatform.trim() : formData.platform;

    const newErrors = {};
    const platErr = validateRequired(finalPlatform, 'Platform');
    if (platErr) newErrors.platform = platErr;

    const urlErr = validateRequired(formData.url, 'URL');
    if (urlErr) newErrors.url = urlErr;

    const orderErr = validateNumber(formData.displayOrder, 'Display Order', 0);
    if (orderErr) newErrors.displayOrder = orderErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const payload = {
      platform: finalPlatform,
      url: formData.url,
      displayOrder: Number(formData.displayOrder),
      visible: formData.visible
    };

    try {
      if (editingLink) {
        await socialLinksApi.update(editingLink.id, payload);
        addToast('Social link updated successfully', 'success');
      } else {
        await socialLinksApi.create(payload);
        addToast('Social link created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchSocialLinks();
    } catch (err) {
      addToast(err?.message || 'Failed to save social link', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await socialLinksApi.delete(deleteTarget.id);
      addToast('Social link deleted successfully', 'success');
      setDeleteTarget(null);
      fetchSocialLinks();
    } catch (err) {
      addToast(err?.message || 'Failed to delete social link', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="social-links-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Social Links</h2>
          <p className="admin-page-subtitle">Configure external channels displayed across the hero and footer</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Social Link
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Icon</th>
              <th>Platform</th>
              <th>Destination URL</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No social links configured yet. Click "Add Social Link" above.
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id}>
                  <td>{link.displayOrder}</td>
                  <td>
                    <span style={{ color: 'var(--color-accent)', display: 'inline-flex' }}>
                      {getPlatformIcon(link.platform)}
                    </span>
                  </td>
                  <td className="font-semibold">{link.platform}</td>
                  <td>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>{link.url}</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td>{link.visible !== false ? 'Visible' : 'Hidden'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(link)}
                        aria-label={`Edit ${link.platform}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(link)}
                        style={{ color: 'var(--color-danger)' }}
                        aria-label={`Delete ${link.platform}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingLink ? 'Edit Social Link' : 'Create Social Link'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="social-platform-select">Platform Preset</label>
            <select
              id="social-platform-select"
              name="platform"
              className="form-select"
              value={formData.platform}
              onChange={handleChange}
            >
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter / X</option>
              <option value="Instagram">Instagram</option>
              <option value="YouTube">YouTube</option>
              <option value="Website">Personal Website / Blog</option>
              <option value="Other">Custom / Other</option>
            </select>
          </div>

          {formData.platform === 'Other' && (
            <Input
              label="Custom Platform Name"
              name="customPlatform"
              placeholder="e.g. Medium, Substack, Discord"
              value={formData.customPlatform}
              onChange={handleChange}
              error={errors.platform}
              required
            />
          )}

          <Input
            label="Destination Profile URL"
            name="url"
            placeholder="https://github.com/rajpandya"
            value={formData.url}
            onChange={handleChange}
            error={errors.url}
            required
          />

          <Input
            label="Display Order"
            name="displayOrder"
            type="number"
            min="0"
            value={formData.displayOrder}
            onChange={handleChange}
            error={errors.displayOrder}
            required
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <input
              type="checkbox"
              id="visible-social-checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="visible-social-checkbox" style={{ fontSize: '0.9375rem', cursor: 'pointer' }}>
              Visible on public site (Hero & Footer)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingLink ? 'Update Social Link' : 'Create Social Link'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Social Link"
        message={`Are you sure you want to delete ${deleteTarget?.platform} link?`}
      />
    </div>
  );
}
