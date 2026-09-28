import React from 'react';
import { Modal } from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';
import './ConfirmDialog.css';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  isLoading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="420px">
      <div className="confirm-dialog-content">
        <div className="confirm-dialog-icon">
          <AlertTriangle size={32} />
        </div>
        <p className="confirm-dialog-text">{message}</p>
        <div className="confirm-dialog-actions">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
