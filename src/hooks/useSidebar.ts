import { useState, useCallback } from 'react';

// Custom hook for sidebar state management
export const useSidebar = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  };
};
