import { useState, useCallback } from 'react';

export const useModal = (initialOpen = false) => {// modal başlangıç durumu
  const [isOpen, setIsOpen] = useState(initialOpen);// modal açık/kapalı durumu
  const [editingId, setEditingId] = useState<string | null>(null);

  const openModal = useCallback((id?: string) => {// modalı açma işlevi
    setEditingId(id || null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingId(null);
  }, []);

  const openForEdit = useCallback((id: string) => {// belirli bir ID için modalı düzenleme modunda açma işlevi
    setEditingId(id);
    setIsOpen(true);
  }, []);

  const openForCreate = useCallback(() => {// yeni oluşturma modunda modalı açma işlevi
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
