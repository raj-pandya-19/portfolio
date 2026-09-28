import React, { useEffect, useState } from 'react';
import { mediaApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { resolveMediaUrl } from '../../utils/resolveMediaUrl';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { FileText, Trash2, Copy, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import './MediaLibrary.css';

export default function MediaLibrary() {
  const { addToast } = useToast();
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'IMAGE' | 'PDF'
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchMedia = async () => {
    try {
      const res = await mediaApi.getAll();
      setMediaList(res.data || []);
    } catch (err) {
      addToast('Failed to load media assets', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await mediaApi.delete(deleteTarget.id);
      addToast('Media asset deleted successfully', 'success');
      setDeleteTarget(null);
      fetchMedia();
    } catch (err) {
      addToast(err?.message || 'Failed to delete media asset', 'danger');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = (item) => {
    const fullUrl = resolveMediaUrl(item.url);
    if (!fullUrl) return;

    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(item.id);
      addToast('URL copied to clipboard!', 'info');
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  const filteredMedia = mediaList.filter((item) => {
    if (categoryFilter === 'ALL') return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="media-library-page">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">Media Library</h2>
          <p className="admin-page-subtitle">Inspect uploaded images, resumes, and PDFs with quick URL copying</p>
        </div>

        <div className="category-filter-group">
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('ALL')}
          >
            All ({mediaList.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'IMAGE' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('IMAGE')}
          >
            Images ({mediaList.filter((m) => m.category === 'IMAGE').length})
          </button>
          <button
            type="button"
            className={`filter-btn ${categoryFilter === 'PDF' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('PDF')}
          >
            PDFs ({mediaList.filter((m) => m.category === 'PDF').length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-state">Loading media assets...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="empty-media-card">
          <p>No media files found in this category.</p>
        </div>
      ) : (
        <div className="media-grid">
          {filteredMedia.map((item) => {
            const resolvedUrl = resolveMediaUrl(item.url);
            const isImage = item.category === 'IMAGE' || (item.fileType && item.fileType.startsWith('image/'));

            return (
              <div key={item.id} className="media-asset-card">
                <div className="media-preview-container">
                  {isImage ? (
                    <img src={resolvedUrl} alt={item.originalName} className="media-thumbnail" />
                  ) : (
                    <div className="pdf-doc-placeholder">
                      <FileText size={48} className="pdf-doc-icon" />
                      <span className="pdf-doc-label">PDF Document</span>
                    </div>
                  )}
                  <Badge variant={isImage ? 'accent' : 'neutral'} size="sm" className="media-badge">
                    {item.category || (isImage ? 'IMAGE' : 'PDF')}
                  </Badge>
                </div>

                <div className="media-info-block">
                  <span className="media-filename" title={item.originalName || item.storedName}>
                    {item.originalName || item.storedName}
                  </span>

                  <div className="media-meta-line">
                    <span>{formatFileSize(item.fileSize)}</span>
                    {item.createdAt && <span>· {formatDate(item.createdAt)}</span>}
                  </div>

                  <div className="media-card-actions">
                    <button
                      type="button"
                      className="media-action-btn"
                      onClick={() => handleCopyUrl(item)}
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check size={16} color="var(--color-success)" /> : <Copy size={16} />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <a
                      href={resolvedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="media-action-btn"
                      title="Open in new tab"
                    >
                      <ExternalLink size={16} />
                      <span>View</span>
                    </a>

                    <button
                      type="button"
                      className="media-action-btn delete-btn"
                      onClick={() => setDeleteTarget(item)}
                      title="Delete asset"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Media File"
        message={`Are you sure you want to permanently delete "${deleteTarget?.originalName || deleteTarget?.storedName}" from storage?`}
      />
    </div>
  );
}
