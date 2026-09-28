import React, { useEffect, useState } from 'react';
import { trainingApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import FileUploadField from '../../components/shared/FileUploadField';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function TrainingAdmin() {
  const { addToast } = useToast();
  const [trainingList, setTrainingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    title: '',
    organization: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    certificateUrl: '',
    displayOrder: 0,
    current: false
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchTraining = async () => {
    try {
      const res = await trainingApi.getAll();
      setTrainingList(res.data || []);
    } catch (err) {
      addToast('Failed to load training items', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraining();
  }, []);

  const handleOpenCreate = () => {
    setEditingTraining(null);
    setFormData({ ...initialForm, displayOrder: trainingList.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingTraining(item);
    setFormData({
      title: item.title || '',
      organization: item.organization || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      location: item.location || '',
      description: item.description || '',
      certificateUrl: item.certificateUrl || '',
      displayOrder: item.displayOrder ?? 0,
      current: !!item.current
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const titleErr = validateRequired(formData.title, 'Training Title');
    if (titleErr) newErrors.title = titleErr;

    const orgErr = validateRequired(formData.organization, 'Organization');
    if (orgErr) newErrors.organization = orgErr;

    const startErr = validateRequired(formData.startDate, 'Start Date');
    if (startErr) newErrors.startDate = startErr;

    const descErr = validateRequired(formData.description, 'Description');
    if (descErr) newErrors.description = descErr;

    const orderErr = validateNumber(formData.displayOrder, 'Display Order', 0);
    if (orderErr) newErrors.displayOrder = orderErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const payload = {
      ...formData,
      endDate: formData.current ? '' : formData.endDate,
      displayOrder: Number(formData.displayOrder)
    };

    try {
      if (editingTraining) {
        await trainingApi.update(editingTraining.id, payload);
        addToast('Training item updated successfully', 'success');
      } else {
        await trainingApi.create(payload);
        addToast('Training item created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchTraining();
    } catch (err) {
      addToast(err?.message || 'Failed to save training item', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await trainingApi.delete(deleteTarget.id);
      addToast('Training item deleted successfully', 'success');
      setDeleteTarget(null);
      fetchTraining();
    } catch (err) {
      addToast(err?.message || 'Failed to delete training item', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="training-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Training & Workshops</h2>
          <p className="admin-page-subtitle">Bootcamps, specialized courses, and engineering certifications</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Training
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Organization</th>
              <th>Dates</th>
              <th>Certificate</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainingList.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No training records found. Click "Add Training" above.
                </td>
              </tr>
            ) : (
              trainingList.map((item) => (
                <tr key={item.id}>
                  <td>{item.displayOrder}</td>
                  <td className="font-semibold">{item.title}</td>
                  <td>{item.organization}</td>
                  <td>
                    {item.startDate} – {item.current ? <Badge variant="accent">Present</Badge> : item.endDate || '—'}
                  </td>
                  <td>{item.certificateUrl ? 'Uploaded' : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(item)}
                        aria-label={`Edit ${item.title}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                        style={{ color: 'var(--color-danger)' }}
                        aria-label={`Delete ${item.title}`}
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
        title={editingTraining ? 'Edit Training' : 'Create Training'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Training / Course Title"
            name="title"
            placeholder="Advanced Microservices Architecture"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Organization"
            name="organization"
            placeholder="Coursera / Udemy / Tech Institute"
            value={formData.organization}
            onChange={handleChange}
            error={errors.organization}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Start Date"
              name="startDate"
              placeholder="e.g. Feb 2024"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              placeholder="e.g. May 2024"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.current}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <input
              type="checkbox"
              id="current-training-checkbox"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="current-training-checkbox" style={{ fontSize: '0.9375rem', cursor: 'pointer' }}>
              Currently ongoing training (displays "Present")
            </label>
          </div>

          <Input
            label="Location"
            name="location"
            placeholder="Online / City"
            value={formData.location}
            onChange={handleChange}
          />

          <TextArea
            label="Description"
            name="description"
            placeholder="Curriculum covered, projects completed..."
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            required
          />

          <FileUploadField
            label="Certificate / Proof Document"
            endpointType="pdf"
            value={formData.certificateUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, certificateUrl: url }))}
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
              {editingTraining ? 'Update Training' : 'Create Training'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Training"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
