import { useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title       = 'Are you sure?',
  message     = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText  = 'Cancel',
  type        = 'danger'  // 'danger' | 'warning' | 'info'
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const colors = {
    danger:  { bg: '#fde8ea', icon: '🗑️', btnBg: 'var(--danger)',   btnColor: 'white' },
    warning: { bg: '#fff3e0', icon: '⚠️',  btnBg: 'var(--warning)',  btnColor: 'white' },
    info:    { bg: '#e3f2fd', icon: 'ℹ️',  btnBg: 'var(--primary)',  btnColor: 'white' },
  };
  const c = colors[type] || colors.danger;

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      style={{ animation: 'fadeIn 0.15s ease' }}
    >
      <div
        className="modal"
        style={{ maxWidth: '380px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div style={{
          background: c.bg,
          padding: '28px 24px 20px',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{c.icon}</div>
          <h3 style={{
            fontSize: '1.15rem',
            color: 'var(--primary-dark)',
            fontFamily: 'Poppins, sans-serif',
            marginBottom: '6px'
          }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div style={{
          padding: '16px 24px 20px',
          display: 'flex',
          gap: '10px',
          background: 'white',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
        }}>
          <button
            onClick={onCancel}
            className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn"
            style={{
              flex: 1,
              justifyContent: 'center',
              background: c.btnBg,
              color: c.btnColor,
              border: 'none'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}