import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Run cleanup after each test (unmounts rendered components)
afterEach(() => {
  cleanup();
});
