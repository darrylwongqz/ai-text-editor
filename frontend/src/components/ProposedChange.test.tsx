// src/components/ProposedChange.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProposedChange from './ProposedChange';

describe('ProposedChange component', () => {
  const selectedText = 'Hello';
  const proposedText = 'Mocked paraphrased text';
  const onAccept = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    onAccept.mockReset();
    onCancel.mockReset();
  });

  it('renders with the correct texts', () => {
    render(
      <ProposedChange
        selectedText={selectedText}
        proposedText={proposedText}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );

    // Query the container by its test id
    const container = screen.getByTestId('proposed-change');
    expect(container).toBeInTheDocument();

    // Within this container, check for key text contents.
    expect(container).toHaveTextContent('Proposed Change');
    expect(container).toHaveTextContent('Selected Text:');
    expect(container).toHaveTextContent(selectedText);
    expect(container).toHaveTextContent('Proposed Change:');
    expect(container).toHaveTextContent(proposedText);
  });

  it('calls onAccept when the Accept button is clicked', async () => {
    render(
      <ProposedChange
        selectedText={selectedText}
        proposedText={proposedText}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
    const acceptButton = screen.getByRole('button', { name: /Accept/i });
    await userEvent.click(acceptButton);
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    render(
      <ProposedChange
        selectedText={selectedText}
        proposedText={proposedText}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
