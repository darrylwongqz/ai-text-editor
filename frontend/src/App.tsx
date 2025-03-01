// src/App.tsx
import React, { useState } from 'react';
import TextEditor from './components/TextEditor';
import ProposedChange from './components/ProposedChange';
import TransformationSettings from './components/TransformationSettings';
import ActionButtons from './components/ActionButtons';

interface TransformRequestBody {
  text: string;
  action: 'paraphrase' | 'expand' | 'summarize' | 'translate';
  target_language?: string;
}

const App: React.FC = () => {
  // Main text and selection states.
  const [text, setText] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // UI state.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [selectedText, setSelectedText] = useState('');

  // Transformation settings.
  const [transformAction, setTransformAction] = useState<
    'paraphrase' | 'expand' | 'summarize' | 'translate'
  >('paraphrase');
  const [targetLanguage, setTargetLanguage] = useState('Chinese'); // default for translate

  const handleSelectionChange = (start: number, end: number) => {
    setSelectionStart(start);
    setSelectionEnd(end);
  };

  const handleTransform = async () => {
    if (selectionStart === selectionEnd) {
      alert('Please highlight some text to transform.');
      return;
    }
    setLoading(true);
    setError('');
    setProposedText('');
    setSelectedText('');

    // Extract the selected text.
    const textToTransform = text.slice(selectionStart, selectionEnd);
    setSelectedText(textToTransform);

    // Build the request body with proper typing.
    const requestBody: TransformRequestBody = {
      text: textToTransform,
      action: transformAction,
      ...(transformAction === 'translate' && {
        target_language: targetLanguage,
      }),
    };

    try {
      // Replace with your backend URL or use a Vite proxy.
      const response = await fetch('http://localhost:8080/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to transform. Please try again.');
      }
      const data = await response.json();
      // Instead of immediately replacing the text, store the proposed change.
      setProposedText(data.transformed_text);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    // Replace the selected text with the proposed change.
    const newText =
      text.slice(0, selectionStart) + proposedText + text.slice(selectionEnd);
    setText(newText);
    setSelectionStart(0);
    setSelectionEnd(0);
    setProposedText('');
    setSelectedText('');
  };

  const handleCancel = () => {
    // Dismiss the proposed change.
    setProposedText('');
    setSelectedText('');
  };

  const handleClear = () => {
    setText('');
    setSelectionStart(0);
    setSelectionEnd(0);
    setError('');
    setProposedText('');
    setSelectedText('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Text Editor</h1>

      {/* Transformation Settings */}
      <TransformationSettings
        transformAction={transformAction}
        targetLanguage={targetLanguage}
        onActionChange={setTransformAction}
        onLanguageChange={setTargetLanguage}
      />

      <TextEditor
        text={text}
        onChange={setText}
        onSelectionChange={handleSelectionChange}
      />

      <ActionButtons
        loading={loading}
        onTransform={handleTransform}
        onClear={handleClear}
      />

      {loading && <p className="text-blue-500 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Show the proposed change if available */}
      {proposedText && (
        <ProposedChange
          selectedText={selectedText}
          proposedText={proposedText}
          onAccept={handleAccept}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default App;
