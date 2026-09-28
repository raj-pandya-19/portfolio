import React, { useEffect, useState } from 'react';
import { educationApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function EducationAdmin() {
  const { addToast } = useToast();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    location: '',
    grade: '',
    description: '',
    displayOrder: 0
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchEducation = async () => {
    try {
      const res = await educationApi.getAll();
      setEducationList(res.data || []);
    } catch (err) {
      addToast('Failed to load education entries', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleOpenCreate = () => {
    setEditingEdu(null);
    setFormData({ ...initialForm, displayOrder: educationList.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (edu) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      location: edu.location || '',
      grade: edu.grade || '',
      description: edu.description || '',
      displayOrder: edu.displayOrder ?? 0
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

    const instErr = validateRequired(formData.institution, 'Institution');
    if (instErr) newErrors.institution = instErr;

    const degErr = validateRequired(formData.degree, 'Degree');
    if (degErr) newErrors.degree = degErr;

    const startErr = validateRequired(formData.startDate, 'Start Date');
    if (startErr) newErrors.startDate = startErr;

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
      if (editingEdu) {
        await educationApi.update(editingEdu.id, payload);
        addToast('Education entry updated successfully', 'success');
      } else {
        await educationApi.create(payload);
        addToast('Education entry created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchEducation();
    } catch (err) {
      addToast(err?.message || 'Failed to save education entry', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await educationApi.delete(deleteTarget.id);
      addToast('Education entry deleted successfully', 'success');
      setDeleteTarget(null);
      fetchEducation();
    } catch (err) {
      addToast(err?.message || 'Failed to delete education entry', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="education-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Education</h2>
          <p className="admin-page-subtitle">Degrees, universities, grades, and academic focus areas</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Education
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Degree</th>
              <th>Institution</th>
              <th>Dates</th>
              <th>Field of Study</th>
              <th>Grade</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {educationList.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No education entries yet. Click "Add Education" above.
                </td>
              </tr>
            ) : (
              educationList.map((edu) => (
                <tr key={edu.id}>
                  <td>{edu.displayOrder}</td>
                  <td className="font-semibold">{edu.degree}</td>
                  <td>{edu.institution}</td>
                  <td>{edu.startDate} – {edu.endDate || 'Present'}</td>
                  <td>{edu.fieldOfStudy || '—'}</td>
                  <td>{edu.grade || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(edu)}
                        aria-label={`Edit ${edu.degree}`}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(edu)}
                        style={{ color: 'var(--color-danger)' }}
                        aria-label={`Delete ${edu.degree}`}
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
        title={editingEdu ? 'Edit Education' : 'Create Education'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Degree / Diploma"
            name="degree"
            placeholder="Bachelor of Science in Computer Science"
            value={formData.degree}
            onChange={handleChange}
            error={errors.degree}
            required
          />

          <Input
            label="Institution / University"
            name="institution"
            placeholder="Stanford University"
            value={formData.institution}
            onChange={handleChange}
            error={errors.institution}
            required
          />

          <Input
            label="Field of Study"
            name="fieldOfStudy"
            placeholder="Software Engineering / Computer Systems"
            value={formData.fieldOfStudy}
            onChange={handleChange}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Start Date"
              name="startDate"
              placeholder="e.g. 2020"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              name="endDate"
              placeholder="e.g. 2024"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="Location"
              name="location"
              placeholder="City, State / Country"
              value={formData.location}
              onChange={handleChange}
            />
            <Input
              label="Grade / GPA"
              name="grade"
              placeholder="3.9 / 4.0 or First Class"
              value={formData.grade}
              onChange={handleChange}
            />
          </div>

          <TextArea
            label="Description / Honors"
            name="description"
            placeholder="Relevant coursework, academic achievements..."
            rows={4}
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
              {editingEdu ? 'Update Education' : 'Create Education'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Education"
        message={`Are you sure you want to delete "${deleteTarget?.degree} from ${deleteTarget?.institution}"?`}
      />
    </div>
  );
}
