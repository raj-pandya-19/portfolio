import React, { useEffect, useState } from 'react';
import { certificatesApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FileUploadField from '../../components/shared/FileUploadField';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function CertificatesAdmin() {
  const { addToast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    certificateUrl: '',
    description: '',
    displayOrder: 0
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchCertificates = async () => {
    try {
      const res = await certificatesApi.getAll();
      setCertificates(res.data || []);
    } catch (err) {
      addToast('Failed to load certificates', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenCreate = () => {
    setEditingCert(null);
    setFormData({ ...initialForm, displayOrder: certificates.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || '',
      issuingOrganization: cert.issuingOrganization || '',
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      certificateUrl: cert.certificateUrl || '',
      description: cert.description || '',
      displayOrder: cert.displayOrder ?? 0
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const titleErr = validateRequired(formData.title, 'Certificate Title');
    if (titleErr) newErrors.title = titleErr;

    const orgErr = validateRequired(formData.issuingOrganization, 'Issuing Organization');
    if (orgErr) newErrors.issuingOrganization = orgErr;

    const orderErr = validateNumber(formData.displayOrder, 'Display Order', 0);
    if (orderErr) newErrors.displayOrder = orderErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder)
    };

    try {
      if (editingCert) {
        await certificatesApi.update(editingCert.id, payload);
        addToast('Certificate updated successfully', 'success');
      } else {
        await certificatesApi.create(payload);
        addToast('Certificate created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchCertificates();
    } catch (err) {
      addToast(err?.message || 'Failed to save certificate', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await certificatesApi.delete(deleteTarget.id);
      addToast('Certificate deleted successfully', 'success');
      setDeleteTarget(null);
      fetchCertificates();
    } catch (err) {
      addToast(err?.message || 'Failed to delete certificate', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="certificates-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Certificates</h2>
          <p className="admin-page-subtitle">Add official credentials, verification links, and certificate documents</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Certificate
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Certificate Title</th>
              <th>Organization</th>
              <th>Issue Date</th>
              <th>Credential ID</th>
              <th>Document</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No certificates found. Click "Add Certificate" above.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id}>
                  <td>{cert.displayOrder}</td>
                  <td className="font-semibold">{cert.title}</td>
                  <td>{cert.issuingOrganization}</td>
                  <td>{cert.issueDate || '—'}</td>
                  <td>{cert.credentialId || '—'}</td>
                  <td>{cert.certificateUrl ? 'Uploaded' : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(cert)}
                        aria-label={`Edit ${cert.title}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(cert)}
                        style={{ color: 'var(--color-danger)' }}
                        aria-label={`Delete ${cert.title}`}
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
        title={editingCert ? 'Edit Certificate' : 'Create Certificate'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Certificate Title"
            name="title"
            placeholder="AWS Certified Solutions Architect"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Issuing Organization"
            name="issuingOrganization"
            placeholder="Amazon Web Services"
            value={formData.issuingOrganization}
            onChange={handleChange}
            error={errors.issuingOrganization}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Issue Date"
              name="issueDate"
              placeholder="e.g. 2024-01-15 or Jan 2024"
              value={formData.issueDate}
              onChange={handleChange}
            />
            <Input
              label="Expiry Date"
              name="expiryDate"
              placeholder="e.g. 2027-01-15"
              value={formData.expiryDate}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Credential ID"
            name="credentialId"
            placeholder="AWS-84920492"
            value={formData.credentialId}
            onChange={handleChange}
          />

          <Input
            label="Credential Verification URL"
            name="credentialUrl"
            placeholder="https://www.credly.com/badges/..."
            value={formData.credentialUrl}
            onChange={handleChange}
          />

          <FileUploadField
            label="Certificate Document (PDF or Image)"
            endpointType="pdf"
            value={formData.certificateUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, certificateUrl: url }))}
            helperText="Upload official certificate PDF or badge image"
          />

          <TextArea
            label="Description"
            name="description"
            placeholder="Skills evaluated and knowledge domains covered..."
            rows={3}
            value={formData.description}
            onChange={handleChange}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingCert ? 'Update Certificate' : 'Create Certificate'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
