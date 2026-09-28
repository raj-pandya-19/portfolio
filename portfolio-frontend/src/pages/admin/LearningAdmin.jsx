import React, { useEffect, useState } from 'react';
import { learningApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function LearningAdmin() {
  const { addToast } = useToast();
  const [learningItems, setLearningItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    title: '',
    category: '',
    description: '',
    status: 'In Progress',
    startDate: '',
    targetDate: '',
    displayOrder: 0,
    visible: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchLearning = async () => {
    try {
      const res = await learningApi.getAll();
      setLearningItems(res.data || []);
    } catch (err) {
      addToast('Failed to load learning roadmap items', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearning();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ ...initialForm, displayOrder: learningItems.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || '',
      description: item.description || '',
      status: item.status || 'In Progress',
      startDate: item.startDate || '',
      targetDate: item.targetDate || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const titleErr = validateRequired(formData.title, 'Topic Title');
    if (titleErr) newErrors.title = titleErr;

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
      displayOrder: Number(formData.displayOrder)
    };

    try {
      if (editingItem) {
        await learningApi.update(editingItem.id, payload);
        addToast('Learning item updated successfully', 'success');
      } else {
        await learningApi.create(payload);
        addToast('Learning item created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchLearning();
    } catch (err) {
      addToast(err?.message || 'Failed to save learning item', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await learningApi.delete(deleteTarget.id);
      addToast('Learning item deleted successfully', 'success');
      setDeleteTarget(null);
      fetchLearning();
    } catch (err) {
      addToast(err?.message || 'Failed to delete learning item', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusVariant = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'warning';
    if (s.includes('completed') || s.includes('done')) return 'success';
    return 'neutral';
  };

  return (
    <div className="learning-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Currently Learning</h2>
          <p className="admin-page-subtitle">Personal technical roadmaps, target dates, and public visibility</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Learning Item
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Topic Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Target Date</th>
              <th>Visibility</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {learningItems.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No learning roadmap items yet. Click "Add Learning Item" above.
                </td>
              </tr>
            ) : (
              learningItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.displayOrder}</td>
                  <td className="font-semibold">{item.title}</td>
                  <td>{item.category || '—'}</td>
                  <td>
                    <Badge variant={getStatusVariant(item.status)} size="sm">
                      {item.status || 'Planned'}
                    </Badge>
                  </td>
                  <td>{item.targetDate || '—'}</td>
                  <td>
                    {item.visible !== false ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontSize: '0.8125rem' }}>
                        <Eye size={14} /> Visible
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                        <EyeOff size={14} /> Hidden
                      </span>
                    )}
                  </td>
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
        title={editingItem ? 'Edit Learning Item' : 'Create Learning Item'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Topic / Technology Title"
            name="title"
            placeholder="Kubernetes Orchestration / Rust"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Category"
            name="category"
            placeholder="DevOps / Systems / AI"
            value={formData.category}
            onChange={handleChange}
          />

          <div className="form-group">
            <label className="form-label" htmlFor="learning-status-select">Status</label>
            <select
              id="learning-status-select"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Start Date"
              name="startDate"
              placeholder="e.g. Sep 2024"
              value={formData.startDate}
              onChange={handleChange}
            />
            <Input
              label="Target Completion Date"
              name="targetDate"
              placeholder="e.g. Dec 2024"
              value={formData.targetDate}
              onChange={handleChange}
            />
          </div>

          <TextArea
            label="Description & Learning Objectives"
            name="description"
            placeholder="Understanding cluster management, ingress controllers..."
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
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
              id="visible-learning-checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="visible-learning-checkbox" style={{ fontSize: '0.9375rem', cursor: 'pointer' }}>
              Visible on public portfolio site
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingItem ? 'Update Learning Item' : 'Create Learning Item'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Learning Item"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
