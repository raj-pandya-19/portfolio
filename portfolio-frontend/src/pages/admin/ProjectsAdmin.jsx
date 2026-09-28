import React, { useEffect, useState } from 'react';
import { projectsApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Drawer } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Input, TextArea } from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import FileUploadField from '../../components/shared/FileUploadField';
import { resolveMediaUrl } from '../../utils/resolveMediaUrl';
import { validateRequired, validateNumber } from '../../utils/validators';
import { Plus, Edit2, Trash2, Globe, CheckCircle2, XCircle } from 'lucide-react';
import { Github } from '../../components/shared/SocialIcons';

export default function ProjectsAdmin() {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    displayOrder: 0,
    published: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      setProjects(res.data || []);
    } catch (err) {
      addToast('Failed to load projects', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({ ...initialForm, displayOrder: projects.length });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: project.technologies || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrl: project.imageUrl || '',
      displayOrder: project.displayOrder ?? 0,
      published: project.published !== false
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

    const titleErr = validateRequired(formData.title, 'Project Title');
    if (titleErr) newErrors.title = titleErr;

    const descErr = validateRequired(formData.description, 'Description');
    if (descErr) newErrors.description = descErr;

    const techErr = validateRequired(formData.technologies, 'Technologies');
    if (techErr) newErrors.technologies = techErr;

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
      if (editingProject) {
        await projectsApi.update(editingProject.id, payload);
        addToast('Project updated successfully', 'success');
      } else {
        await projectsApi.create(payload);
        addToast('Project created successfully', 'success');
      }
      setIsDrawerOpen(false);
      fetchProjects();
    } catch (err) {
      addToast(err?.message || 'Failed to save project', 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await projectsApi.delete(deleteTarget.id);
      addToast('Project deleted successfully', 'success');
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      addToast(err?.message || 'Failed to delete project', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="projects-admin-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Manage Projects</h2>
          <p className="admin-page-subtitle">Curate featured portfolio showcases, code links, and cover imagery</p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={handleOpenCreate}>
          Add Project
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Cover</th>
              <th>Project Title</th>
              <th>Tech Stack</th>
              <th>Links</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                  No projects created yet. Click "Add Project" above.
                </td>
              </tr>
            ) : (
              projects.map((proj) => {
                const img = resolveMediaUrl(proj.imageUrl);
                return (
                  <tr key={proj.id}>
                    <td>{proj.displayOrder}</td>
                    <td>
                      {img ? (
                        <img
                          src={img}
                          alt=""
                          style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="font-semibold">{proj.title}</td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {proj.technologies}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub Source">
                            <Github size={16} />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Site">
                            <Globe size={16} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      {proj.published !== false ? (
                        <Badge variant="success" size="sm">Published</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Draft</Badge>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(proj)}
                          aria-label={`Edit ${proj.title}`}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(proj)}
                          style={{ color: 'var(--color-danger)' }}
                          aria-label={`Delete ${proj.title}`}
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

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create Project'}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Project Title"
            name="title"
            placeholder="Cloud Infrastructure Monitor"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Technologies (comma-separated)"
            name="technologies"
            placeholder="React, Spring Boot, PostgreSQL, Docker, AWS"
            value={formData.technologies}
            onChange={handleChange}
            error={errors.technologies}
            helperText="Separate each tech stack tag with a comma"
            required
          />

          <FileUploadField
            label="Project Cover Image"
            endpointType="image"
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            helperText="16:9 ratio recommended (JPG, PNG, WEBP)"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <Input
              label="GitHub Repository URL"
              name="githubUrl"
              placeholder="https://github.com/..."
              value={formData.githubUrl}
              onChange={handleChange}
            />
            <Input
              label="Live Production / Demo URL"
              name="liveUrl"
              placeholder="https://myproject.com"
              value={formData.liveUrl}
              onChange={handleChange}
            />
          </div>

          <TextArea
            label="Project Description"
            name="description"
            placeholder="Comprehensive description of the architectural decisions, features, and results..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <input
              type="checkbox"
              id="published-project-checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="published-project-checkbox" style={{ fontSize: '0.9375rem', cursor: 'pointer' }}>
              Published (visible on public site)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </div>
  );
}
