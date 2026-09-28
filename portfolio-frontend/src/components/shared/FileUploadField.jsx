import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { uploadApi } from '../../api';
import { resolveMediaUrl } from '../../utils/resolveMediaUrl';
import { formatFileSize } from '../../utils/formatters';
import './FileUploadField.css';

/**
 * Reusable FileUploadField supporting drag & drop, client validation, progress bar, preview
 * endpointType: 'image' | 'pdf' | 'resume'
 */
export default function FileUploadField({
  label = 'Upload File',
  endpointType = 'image', // 'image' | 'pdf' | 'resume'
  value, // existing relative or absolute URL string
  onChange, // callback(url)
  required = false,
  error = null,
  helperText = ''
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const limits = {
    image: {
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxBytes: 5 * 1024 * 1024,
      maxLabel: '5 MB',
      typesLabel: 'JPG, PNG, WEBP',
      uploadFn: uploadApi.uploadImage
    },
    pdf: {
      allowedTypes: ['application/pdf'],
      maxBytes: 10 * 1024 * 1024,
      maxLabel: '10 MB',
      typesLabel: 'PDF only',
      uploadFn: uploadApi.uploadPdf
    },
    resume: {
      allowedTypes: ['application/pdf'],
      maxBytes: 10 * 1024 * 1024,
      maxLabel: '10 MB',
      typesLabel: 'PDF only',
      uploadFn: uploadApi.uploadResume
    }
  };

  const currentConfig = limits[endpointType] || limits.image;

  const handleFileSelection = async (file) => {
    if (!file) return;

    // Client-side pre-validation
    if (!currentConfig.allowedTypes.includes(file.type)) {
      setUploadError(`Invalid file format. Allowed: ${currentConfig.typesLabel}`);
      return;
    }

    if (file.size > currentConfig.maxBytes) {
      setUploadError(`File is too large (${formatFileSize(file.size)}). Max allowed is ${currentConfig.maxLabel}`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await currentConfig.uploadFn(formData, (progress) => {
        setUploadProgress(progress);
      });
      setIsUploading(false);
      // Backend returns { message: "...", url: "/uploads/..." }
      if (res.data?.url) {
        onChange(res.data.url);
      }
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      const errMsg = err?.message || 'File upload failed. Please try again.';
      setUploadError(errMsg);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resolvedUrl = resolveMediaUrl(value);
  const isPdf = endpointType === 'pdf' || endpointType === 'resume' || (value && value.toLowerCase().endsWith('.pdf'));

  return (
    <div className={`file-upload-wrapper ${error || uploadError ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      {value ? (
        <div className="file-preview-card">
          {isPdf ? (
            <div className="pdf-preview-box">
              <FileText size={32} className="pdf-icon" />
              <div className="preview-details">
                <a href={resolvedUrl} target="_blank" rel="noopener noreferrer" className="preview-filename">
                  {value.split('/').pop()}
                </a>
                <span className="preview-subtext">Click to preview in new tab</span>
              </div>
            </div>
          ) : (
            <div className="image-preview-box">
              <img src={resolvedUrl} alt="Upload preview" className="preview-img" />
              <div className="preview-details">
                <span className="preview-filename">{value.split('/').pop()}</span>
                <span className="preview-subtext">Upload successful</span>
              </div>
            </div>
          )}

          <button
            type="button"
            className="file-remove-btn"
            onClick={handleRemove}
            title="Remove file"
            aria-label="Remove uploaded file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${isUploading ? 'dropzone-uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept={currentConfig.allowedTypes.join(',')}
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileSelection(e.target.files[0]);
            }}
          />

          {isUploading ? (
            <div className="upload-progress-box">
              <div className="progress-info">
                <span>Uploading... {uploadProgress}%</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <div className="dropzone-content">
              <UploadCloud size={32} className="dropzone-icon" />
              <p className="dropzone-text">
                <strong>Click to browse</strong> or drag & drop file here
              </p>
              <p className="dropzone-hint">
                {currentConfig.typesLabel} (Max {currentConfig.maxLabel})
              </p>
            </div>
          )}
        </div>
      )}

      {(uploadError || error) && (
        <span className="form-error">
          <AlertCircle size={14} style={{ display: 'inline', marginRight: 4 }} />
          {uploadError || error}
        </span>
      )}

      {!uploadError && !error && helperText && <span className="form-helper">{helperText}</span>}
    </div>
  );
}
