// src/components/TextEditor.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextEditor from './TextEditor';
import React from 'react';

// A wrapper component to simulate a controlled TextEditor.
const Wrapper: React.FC<{
  onSelectionChange: (start: number, end: number) => void;
  onChangeCallback: (value: string) => void;
}> = ({ onSelectionChange, onChangeCallback }) => {
  const [value, setValue] = React.useState('');
  const handleChange = (newValue: string) => {
    setValue(newValue);
    onChangeCallback(newValue);
  };
  return (
    <TextEditor
      text={value}
      onChange={handleChange}
      onSelectionChange={onSelectionChange}
    />
  );
};

describe('TextEditor component', () => {
  const onChangeMock = vi.fn();
  const onSelectionChangeMock = vi.fn();

  beforeEach(() => {
    onChangeMock.mockClear();
    onSelectionChangeMock.mockClear();
  });

  it('renders the textarea with correct placeholder and value', () => {
    // Render TextEditor directly with an initial value.
    render(
      <TextEditor
        text="Initial text"
        onChange={onChangeMock}
        onSelectionChange={onSelectionChangeMock}
      />
    );
    const textarea = screen.getByTestId('text-editor') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.placeholder).toBe(
      'Type or paste your text here, then highlight a portion to transform...'
    );
    expect(textarea.value).toBe('Initial text');
  });

  it('updates text state when typing in the text editor', async () => {
    render(
      <Wrapper
        onSelectionChange={onSelectionChangeMock}
        onChangeCallback={onChangeMock}
      />
    );
    const textarea = screen.getByTestId('text-editor') as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    // Now the textarea's value should be updated by the wrapper state.
    expect(textarea.value).toBe('Hello world');
    // Also, onChangeMock should have been called with "Hello world" as the last argument.
    const calls = onChangeMock.mock.calls;
    const lastCallArg = calls[calls.length - 1][0];
    expect(lastCallArg).toBe('Hello world');
  });

  it('calls onSelectionChange when text is selected', () => {
    render(
      <TextEditor
        text="Hello world"
        onChange={onChangeMock}
        onSelectionChange={onSelectionChangeMock}
      />
    );
    const textarea = screen.getByTestId('text-editor') as HTMLTextAreaElement;
    // Manually set selectionStart and selectionEnd.
    textarea.selectionStart = 0;
    textarea.selectionEnd = 5;
    fireEvent.select(textarea);
    expect(onSelectionChangeMock).toHaveBeenCalledTimes(1);
    expect(onSelectionChangeMock).toHaveBeenCalledWith(0, 5);
  });
});
