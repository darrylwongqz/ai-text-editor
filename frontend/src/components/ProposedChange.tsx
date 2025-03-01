import React from 'react';

type ProposedChangeProps = {
  selectedText: string;
  proposedText: string;
  onAccept: () => void;
  onCancel: () => void;
};

const ProposedChange: React.FC<ProposedChangeProps> = ({
  selectedText,
  proposedText,
  onAccept,
  onCancel,
}) => {
  return (
    <div
      data-testid="proposed-change"
      className="border border-green-500 p-4 mt-4 rounded"
    >
      <h2 className="text-xl font-semibold mb-2">Proposed Change</h2>
      <div className="mb-4">
        <strong>Selected Text:</strong>
        <p>{selectedText}</p>
      </div>
      <div className="mb-4">
        <strong>Proposed Change:</strong>
        <p>{proposedText}</p>
      </div>
      <div className="flex space-x-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={onAccept}
        >
          Accept
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProposedChange;
