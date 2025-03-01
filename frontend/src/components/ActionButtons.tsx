import React from 'react';

interface ActionButtonsProps {
  loading: boolean;
  onTransform: () => void;
  onClear: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  onTransform,
  onClear,
}) => {
  return (
    <div className="flex items-center space-x-2 mt-4">
      <button
        data-testid="transform-button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onTransform}
        disabled={loading}
      >
        Transform
      </button>
      <button
        data-testid="clear-button"
        className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onClear}
        disabled={loading}
      >
        Clear
      </button>
    </div>
  );
};

export default ActionButtons;
