// src/components/ActionButtons.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ActionButtons from './ActionButtons';

describe('ActionButtons component', () => {
  it('renders both buttons with correct labels', () => {
    render(
      <ActionButtons loading={false} onTransform={vi.fn()} onClear={vi.fn()} />
    );
    // Query buttons by data-testid and check their text.
    expect(screen.getByTestId('transform-button')).toHaveTextContent(
      /Transform/i
    );
    expect(screen.getByTestId('clear-button')).toHaveTextContent(/Clear/i);
  });

  it('calls onTransform when the Transform button is clicked', async () => {
    const onTransformMock = vi.fn();
    render(
      <ActionButtons
        loading={false}
        onTransform={onTransformMock}
        onClear={vi.fn()}
      />
    );
    const transformButton = screen.getByTestId('transform-button');
    await userEvent.click(transformButton);
    expect(onTransformMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when the Clear button is clicked', async () => {
    const onClearMock = vi.fn();
    render(
      <ActionButtons
        loading={false}
        onTransform={vi.fn()}
        onClear={onClearMock}
      />
    );
    const clearButton = screen.getByTestId('clear-button');
    await userEvent.click(clearButton);
    expect(onClearMock).toHaveBeenCalledTimes(1);
  });

  it('disables both buttons when loading is true', () => {
    render(
      <ActionButtons loading={true} onTransform={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByTestId('transform-button')).toBeDisabled();
    expect(screen.getByTestId('clear-button')).toBeDisabled();
  });

  it('enables both buttons when loading is false', () => {
    render(
      <ActionButtons loading={false} onTransform={vi.fn()} onClear={vi.fn()} />
    );
    expect(screen.getByTestId('transform-button')).not.toBeDisabled();
    expect(screen.getByTestId('clear-button')).not.toBeDisabled();
  });
});
