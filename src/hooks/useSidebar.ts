import { useState, useCallback } from 'react';

// Custom hook for sidebar state management
export const useSidebar = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleSidebar = useCallback(() => {// sidebar açma kapama fonksiyonu
    setIsOpen(prev => !prev);
  }, []);

  const openSidebar = useCallback(() => {// sidebar açma fonksiyonu
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
