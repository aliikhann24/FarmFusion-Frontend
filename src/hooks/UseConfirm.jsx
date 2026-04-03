import { useState, useCallback } from 'react';

export default function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen:      false,
    title:       '',
    message:     '',
    confirmText: 'Delete',
    cancelText:  'Cancel',
    type:        'danger',
    resolve:     null,
  });

  const confirm = useCallback(({
    title       = 'Are you sure?',
    message     = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText  = 'Cancel',
    type        = 'danger',
  } = {}) => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, title, message, confirmText, cancelText, type, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.resolve?.(true);
    setConfirmState(s => ({ ...s, isOpen: false }));
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    confirmState.resolve?.(false);
    setConfirmState(s => ({ ...s, isOpen: false }));
  }, [confirmState]);

  return { confirm, confirmState, handleConfirm, handleCancel };
}