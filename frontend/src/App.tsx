// src/App.tsx
import React, { useState } from 'react';
import TextEditor from './components/TextEditor';

const App: React.FC = () => {
  // The text in the editor
  const [text, setText] = useState('');

  // Track the selection range
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // UI states for loading/error (when calling the AI paraphrase endpoint)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Update selection range whenever the user selects text in the TextEditor.
   */
  const handleSelectionChange = (start: number, end: number) => {
    setSelectionStart(start);
    setSelectionEnd(end);
    console.log('start::end ', start, end);
  };

  /**
   * Handle paraphrasing only the selected portion of the text (if any).
   */
  const handleParaphrase = async () => {
    // If there's no selection, do nothing (or paraphrase entire text if you prefer).
    if (selectionStart === selectionEnd) {
      alert('Please highlight some text to paraphrase.');
      return;
    }

    setLoading(true);
    setError('');

    // Extract the portion of the text the user selected
    const textToParaphrase = text.slice(selectionStart, selectionEnd);

    try {
      // Placeholder fetch call to your Rust backend
      // e.g., const response = await fetch('http://localhost:8080/api/paraphrase', ...)
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParaphrase }),
      });

      if (!response.ok) {
        throw new Error('Failed to paraphrase. Please try again.');
      }

      const data = await response.json();
      // Suppose the server returns { paraphrasedText: '...' }
      const { paraphrasedText } = data;

      // Reconstruct the entire text by replacing only the selected portion
      const newText =
        text.slice(0, selectionStart) +
        paraphrasedText +
        text.slice(selectionEnd);

      setText(newText);

      // Optionally, reset the selection to zero-length after paraphrasing
      setSelectionStart(0);
      setSelectionEnd(0);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setSelectionStart(0);
    setSelectionEnd(0);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Text Editor</h1>

      <TextEditor
        text={text}
        onChange={setText}
        onSelectionChange={handleSelectionChange}
      />

      <div className="flex items-center space-x-2 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleParaphrase}
          disabled={loading || text.trim().length === 0}
        >
          Paraphrase
        </button>

        <button
          className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleClear}
          disabled={loading || text.trim().length === 0}
        >
          Clear
        </button>
      </div>

      {loading && <p className="text-blue-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default App;
