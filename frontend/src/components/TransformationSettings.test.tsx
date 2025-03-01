// src/components/TransformationSettings.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransformationSettings, {
  TransformationAction,
} from './TransformationSettings';

describe('TransformationSettings component', () => {
  const onActionChangeMock = vi.fn();
  const onLanguageChangeMock = vi.fn();

  beforeEach(() => {
    onActionChangeMock.mockReset();
    onLanguageChangeMock.mockReset();
  });

  it('renders the transformation action select with correct value', () => {
    render(
      <TransformationSettings
        transformAction="paraphrase"
        targetLanguage="Chinese"
        onActionChange={onActionChangeMock}
        onLanguageChange={onLanguageChangeMock}
      />
    );
    const actionSelect = screen.getByTestId(
      'transform-action-select'
    ) as HTMLSelectElement;
    expect(actionSelect).toBeInTheDocument();
    expect(actionSelect.value).toBe('paraphrase');
  });

  it('does not render the target language select when action is not translate', () => {
    render(
      <TransformationSettings
        transformAction="paraphrase"
        targetLanguage="Chinese"
        onActionChange={onActionChangeMock}
        onLanguageChange={onLanguageChangeMock}
      />
    );
    expect(screen.queryByTestId('target-language-select')).toBeNull();
  });

  it('renders the target language select when action is translate', () => {
    render(
      <TransformationSettings
        transformAction="translate"
        targetLanguage="Chinese"
        onActionChange={onActionChangeMock}
        onLanguageChange={onLanguageChangeMock}
      />
    );
    const languageContainer = screen.getByTestId('target-language-container');
    expect(languageContainer).toBeInTheDocument();
    const languageSelect = screen.getByTestId(
      'target-language-select'
    ) as HTMLSelectElement;
    expect(languageSelect).toBeInTheDocument();
    expect(languageSelect.value).toBe('Chinese');
  });

  it('calls onActionChange when the transformation action is changed', async () => {
    render(
      <TransformationSettings
        transformAction="paraphrase"
        targetLanguage="Chinese"
        onActionChange={onActionChangeMock}
        onLanguageChange={onLanguageChangeMock}
      />
    );
    const actionSelect = screen.getByTestId(
      'transform-action-select'
    ) as HTMLSelectElement;
    await userEvent.selectOptions(actionSelect, 'expand');
    expect(onActionChangeMock).toHaveBeenCalledTimes(1);
    expect(onActionChangeMock).toHaveBeenCalledWith(
      'expand' as TransformationAction
    );
  });

  it('calls onLanguageChange when the target language is changed', async () => {
    render(
      <TransformationSettings
        transformAction="translate"
        targetLanguage="Chinese"
        onActionChange={onActionChangeMock}
        onLanguageChange={onLanguageChangeMock}
      />
    );
    const languageSelect = screen.getByTestId(
      'target-language-select'
    ) as HTMLSelectElement;
    await userEvent.selectOptions(languageSelect, 'Spanish');
    expect(onLanguageChangeMock).toHaveBeenCalledTimes(1);
    expect(onLanguageChangeMock).toHaveBeenCalledWith('Spanish');
  });
});
