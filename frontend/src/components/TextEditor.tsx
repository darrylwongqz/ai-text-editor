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
  /**
   * This handler updates the parent with the current selection range
   * whenever the user selects text in the textarea.
   */
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    // Type assertion to get selectionStart, selectionEnd
    const selectionStart = (target as HTMLTextAreaElement).selectionStart;
    const selectionEnd = (target as HTMLTextAreaElement).selectionEnd;
    onSelectionChange(selectionStart, selectionEnd);
  };

  return (
    <textarea
      className="w-full h-64 p-2 border border-gray-300 rounded focus:outline-none"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      onSelect={handleSelect}
      placeholder="Type or paste your text here, then highlight a portion to paraphrase..."
    />
  );
};

export default TextEditor;
