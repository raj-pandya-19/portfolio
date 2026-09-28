import React, { useState } from 'react';
import { resolveMediaUrl } from '../../utils/resolveMediaUrl';
import { Image as ImageIcon } from 'lucide-react';
import './MediaImage.css';

export default function MediaImage({ src, alt, className = '', fallbackType = 'image' }) {
  const [hasError, setHasError] = useState(false);
  const resolved = resolveMediaUrl(src);

  if (!resolved || hasError) {
    return (
      <div className={`media-image-placeholder ${className}`} role="img" aria-label={alt || 'Image placeholder'}>
        <ImageIcon size={32} />
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt || 'Media image'}
      className={`media-image-img ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
