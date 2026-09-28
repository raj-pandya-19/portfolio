import React, { useEffect, useState } from 'react';
import { experiencesApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function ExperiencesAdmin() {
  const { addToast } = useToast();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    technologies: '',
    current: false,
    displayOrder: 0
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchExperiences = async () => {
    try {
      const res = await experiencesApi.getAll();
      setExperiences(res.data || []);
    } catch (err) {
      addToast('Failed to load experiences', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleOpenCreate = () => {
    setEditingExp(null);
    setFormData({ ...initialForm, displayOrder: experiences.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company || '',
      role: exp.role || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      location: exp.location || '',
      description: exp.description || '',
      technologies: exp.technologies || '',
      current: !!exp.current,
      displayOrder: exp.displayOrder ?? 0
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

    const compErr = validateRequired(formData.company, 'Company');
    if (compErr) newErrors.company = compErr;

    const roleErr = validateRequired(formData.role, 'Role');
    if (roleErr) newErrors.role = roleErr;

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
      if (editingExp) {
        await experiencesApi.update(editingExp.id, payload);
        addToast('Experience updated successfully', 'success');
      } else {
        await experiencesApi.create(payload);
        addToast('Experience created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchExperiences();
    } catch (err) {
      addToast(err?.message || 'Failed to save experience', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await experiencesApi.delete(deleteTarget.id);
      addToast('Experience deleted successfully', 'success');
      setDeleteTarget(null);
      fetchExperiences();
    } catch (err) {
      addToast(err?.message || 'Failed to delete experience', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="experiences-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Experiences</h2>
          <p className="admin-page-subtitle">Track job roles, career milestones, technologies, and achievements</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Experience
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Role</th>
              <th>Company</th>
              <th>Dates</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No experiences found. Click "Add Experience" above.
                </td>
              </tr>
            ) : (
              experiences.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.displayOrder}</td>
                  <td className="font-semibold">{exp.role}</td>
                  <td>{exp.company}</td>
                  <td>
                    {exp.startDate} – {exp.current ? <Badge variant="accent">Present</Badge> : exp.endDate || '—'}
                  </td>
                  <td>{exp.location || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(exp)}
                        aria-label={`Edit ${exp.role}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(exp)}
                        style={{ color: 'var(--color-danger)' }}
                        aria-label={`Delete ${exp.role}`}
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

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingExp ? 'Edit Experience' : 'Create Experience'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Job Role / Title"
            name="role"
            placeholder="Senior Software Engineer"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            required
          />

          <Input
            label="Company"
            name="company"
            placeholder="Tech Corp / Startup"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Start Date"
              name="startDate"
              placeholder="e.g. Jan 2023"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              placeholder="e.g. Dec 2024"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.current}
              helperText={formData.current ? 'Current position' : ''}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <input
              type="checkbox"
              id="current-exp-checkbox"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="current-exp-checkbox" style={{ fontSize: '0.9375rem', cursor: 'pointer' }}>
              I currently work here (displays "Present")
            </label>
          </div>

          <Input
            label="Location"
            name="location"
            placeholder="Remote / New York, NY"
            value={formData.location}
            onChange={handleChange}
          />

          <Input
            label="Technologies (comma-separated)"
            name="technologies"
            placeholder="Java, Spring Boot, React, PostgreSQL, Docker"
            value={formData.technologies}
            onChange={handleChange}
          />

          <TextArea
            label="Description & Responsibilities"
            name="description"
            placeholder="Spearheaded microservice development..."
            rows={5}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingExp ? 'Update Experience' : 'Create Experience'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Experience"
        message={`Are you sure you want to delete experience "${deleteTarget?.role} at ${deleteTarget?.company}"?`}
      />
    </div>
  );
}
