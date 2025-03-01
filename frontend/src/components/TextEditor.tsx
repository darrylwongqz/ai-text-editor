// src/components/TextEditor.tsx
import React from 'react';

type TextEditorProps = {
  text: string;
  onChange: (newText: string) => void;
  onSelectionChange: (start: number, end: number) => void;
};

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChange,
  onSelectionChange,
}) => {
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    onSelectionChange(selectionStart, selectionEnd);
  };

  return (
    <textarea
      data-testid="text-editor"
      className="w-full h-64 p-2 border border-gray-300 rounded focus:outline-none"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      onSelect={handleSelect}
      placeholder="Type or paste your text here, then highlight a portion to transform..."
    />
  );
};

export default TextEditor;
