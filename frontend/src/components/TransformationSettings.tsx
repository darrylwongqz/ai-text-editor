// src/components/TransformationSettings.tsx
import React from 'react';

export type TransformationAction =
  | 'paraphrase'
  | 'expand'
  | 'summarize'
  | 'translate';

interface TransformationSettingsProps {
  transformAction: TransformationAction;
  targetLanguage: string;
  onActionChange: (action: TransformationAction) => void;
  onLanguageChange: (language: string) => void;
}

const TransformationSettings: React.FC<TransformationSettingsProps> = ({
  transformAction,
  targetLanguage,
  onActionChange,
  onLanguageChange,
}) => {
  return (
    <div className="mb-4" data-testid="transformation-settings">
      <label className="block mb-1 font-semibold" htmlFor="transformAction">
        Transformation Action:
      </label>
      <select
        id="transformAction"
        data-testid="transform-action-select"
        className="border border-gray-300 p-2 rounded w-full"
        value={transformAction}
        onChange={(e) => onActionChange(e.target.value as TransformationAction)}
      >
        <option value="paraphrase">Paraphrase</option>
        <option value="expand">Expand</option>
        <option value="summarize">Summarize</option>
        <option value="translate">Translate</option>
      </select>
      {transformAction === 'translate' && (
        <div className="mt-4" data-testid="target-language-container">
          <label className="block mb-1 font-semibold" htmlFor="targetLanguage">
            Target Language:
          </label>
          <select
            id="targetLanguage"
            data-testid="target-language-select"
            className="border border-gray-300 p-2 rounded w-full"
            value={targetLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="Chinese">Chinese</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            {/* Add additional languages as needed */}
          </select>
        </div>
      )}
    </div>
  );
};

export default TransformationSettings;
