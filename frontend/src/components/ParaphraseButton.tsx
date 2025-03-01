// src/components/ParaphraseButton.tsx
import React from 'react';

type ParaphraseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const ParaphraseButton: React.FC<ParaphraseButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      Paraphrase
    </button>
  );
};

export default ParaphraseButton;
