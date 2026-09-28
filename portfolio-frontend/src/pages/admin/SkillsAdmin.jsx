import React, { useEffect, useState } from 'react';
import { skillsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import FileUploadField from '../../components/shared/FileUploadField';
import { resolveMediaUrl } from '../../utils/resolveMediaUrl';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2, Sparkles } from 'lucide-react';

export default function SkillsAdmin() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    name: '',
    category: '',
    proficiency: 80,
    iconUrl: '',
    displayOrder: 0,
    featured: false
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchSkills = async () => {
    try {
      const res = await skillsApi.getAll();
      setSkills(res.data || []);
    } catch (err) {
      addToast('Failed to load skills', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setFormData({ ...initialForm, displayOrder: skills.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || '',
      proficiency: skill.proficiency ?? 80,
      iconUrl: skill.iconUrl || '',
      displayOrder: skill.displayOrder ?? 0,
      featured: !!skill.featured
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

    const nameErr = validateRequired(formData.name, 'Skill Name');
    if (nameErr) newErrors.name = nameErr;

    const catErr = validateRequired(formData.category, 'Category');
    if (catErr) newErrors.category = catErr;

    const profErr = validateNumber(formData.proficiency, 'Proficiency', 0, 100);
    if (profErr) newErrors.proficiency = profErr;

    const orderErr = validateNumber(formData.displayOrder, 'Display Order', 0);
    if (orderErr) newErrors.displayOrder = orderErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    const payload = {
      ...formData,
      proficiency: Number(formData.proficiency),
      displayOrder: Number(formData.displayOrder)
    };

    try {
      if (editingSkill) {
        await skillsApi.update(editingSkill.id, payload);
        addToast('Skill updated successfully', 'success');
      } else {
        await skillsApi.create(payload);
        addToast('Skill created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchSkills();
    } catch (err) {
      addToast(err?.message || 'Failed to save skill', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await skillsApi.delete(deleteTarget.id);
      addToast('Skill deleted successfully', 'success');
      setDeleteTarget(null);
      fetchSkills();
    } catch (err) {
      addToast(err?.message || 'Failed to delete skill', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="skills-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Skills</h2>
          <p className="admin-page-subtitle">Categorize skills, adjust proficiencies, and toggle featured specializations</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Skill
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Icon</th>
              <th>Skill Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Featured</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No skills created yet. Click "Add Skill" above.
                </td>
              </tr>
            ) : (
              skills.map((skill) => {
                const icon = resolveMediaUrl(skill.iconUrl);
                return (
                  <tr key={skill.id}>
                    <td>{skill.displayOrder}</td>
                    <td>
                      {icon ? (
                        <img src={icon} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="font-semibold">{skill.name}</td>
                    <td>
                      <Badge variant="neutral" size="sm">{skill.category}</Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{skill.proficiency}%</span>
                        <div style={{ width: 60, height: 6, backgroundColor: 'var(--color-surface-alt)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${skill.proficiency}%`, height: '100%', backgroundColor: 'var(--color-accent)' }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {skill.featured ? (
                        <Badge variant="accent" size="sm">
                          <Sparkles size={12} style={{ marginRight: 4 }} />
                          Featured
                        </Badge>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(skill)}
                          aria-label={`Edit ${skill.name}`}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(skill)}
                          style={{ color: 'var(--color-danger)' }}
                          aria-label={`Delete ${skill.name}`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer Form */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Create Skill'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Skill Name"
            name="name"
            placeholder="React.js / Spring Boot"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            label="Category"
            name="category"
            placeholder="Frontend / Backend / Cloud"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            required
          />

          <div className="form-group">
            <label className="form-label">
              Proficiency ({formData.proficiency}%) <span className="required-star">*</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              name="proficiency"
              value={formData.proficiency}
              onChange={handleChange}
              style={{ width: '100%', accentColor: 'var(--color-accent)' }}
            />
            {errors.proficiency && <span className="form-error">{errors.proficiency}</span>}
          </div>

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

          <FileUploadField
            label="Skill Icon"
            endpointType="image"
            value={formData.iconUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, iconUrl: url }))}
            helperText="Upload SVG, PNG, or WEBP icon"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <input
              type="checkbox"
              id="featured-checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="featured-checkbox" style={{ fontSize: '0.9375rem', cursor: 'pointer' }}>
              Feature this skill in hero core stack pills
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingSkill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Drawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
