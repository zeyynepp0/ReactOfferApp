import React from 'react';

interface OperationButtonTriggerProps {
  isOpen: boolean;
  selectedLabel: string;
  onClick: () => void;
}

const OperationButtonTrigger: React.FC<OperationButtonTriggerProps> = ({ isOpen, selectedLabel, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-gray-300 rounded-md p-2 w-full text-sm focus:outline-blue-500 focus:ring-blue-500 flex items-center justify-between bg-white"
    >
      <span className="truncate">{selectedLabel}</span>
      <svg
        className={`w-4 h-4 ml-2 transition-transform flex-shrink-0 text-gray-500 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

export default OperationButtonTrigger;