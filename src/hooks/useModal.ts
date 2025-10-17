import { useState, useCallback } from 'react';

// Custom hook for modal state management
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openModal = useCallback((id?: string) => {
    setEditingId(id || null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingId(null);
  }, []);

  const openForEdit = useCallback((id: string) => {
    setEditingId(id);
    setIsOpen(true);
  }, []);

  const openForCreate = useCallback(() => {
    setEditingId(null);
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    editingId,
    openModal,
    closeModal,
    openForEdit,
    openForCreate,
  };
};
