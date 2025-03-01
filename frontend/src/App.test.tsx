// src/App.test.tsx
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Helper to simulate text selection on a textarea.
function simulateSelection(
  textarea: HTMLTextAreaElement,
  start: number,
  end: number
) {
  textarea.selectionStart = start;
  textarea.selectionEnd = end;
  fireEvent.select(textarea);
}

describe('App component', () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi
      .spyOn(globalThis as { fetch: typeof fetch }, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ transformed_text: 'Mocked transformation' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      ) as unknown as MockInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders header, transformation settings, text editor, and action buttons', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /AI Text Editor/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Transformation Action/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Type or paste your text/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Transform/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
  });

  it('updates text state when typing in the text editor', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      /Type or paste your text/i
    ) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    expect(textarea.value).toBe('Hello world');
  });

  it('alerts when transform is clicked with no selection', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
    // Fill in some text so that the button is enabled.
    const textarea = screen.getByPlaceholderText(
      /Type or paste your text/i
    ) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    const transformButton = screen.getByRole('button', { name: /Transform/i });
    await userEvent.click(transformButton);
    expect(alertSpy).toHaveBeenCalledWith(
      'Please highlight some text to transform.'
    );
    alertSpy.mockRestore();
  });

  it('calls fetch and displays proposed change after transform', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ transformed_text: 'Mocked paraphrased text' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      /Type or paste your text/i
    ) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    simulateSelection(textarea, 0, 5); // select "Hello"

    const transformButton = screen.getByRole('button', { name: /Transform/i });
    userEvent.click(transformButton);

    await waitFor(() => {
      expect(screen.getByTestId('proposed-change')).toBeInTheDocument();
    });
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Mocked paraphrased text')).toBeInTheDocument();
  });

  it('updates text when Accept is clicked', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ transformed_text: 'Mocked paraphrased text' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      /Type or paste your text/i
    ) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    simulateSelection(textarea, 0, 5); // select "Hello"

    const transformButton = screen.getByRole('button', { name: /Transform/i });
    userEvent.click(transformButton);

    await waitFor(() => {
      expect(screen.getByTestId('proposed-change')).toBeInTheDocument();
    });
    const acceptButton = screen.getByRole('button', { name: /Accept/i });
    userEvent.click(acceptButton);

    await waitFor(() => {
      expect(textarea.value).toBe('Mocked paraphrased text world');
    });
  });

  it('dismisses proposed change when Cancel is clicked', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ transformed_text: 'Mocked paraphrased text' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      /Type or paste your text/i
    ) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    simulateSelection(textarea, 0, 5); // select "Hello"

    const transformButton = screen.getByRole('button', { name: /Transform/i });
    userEvent.click(transformButton);

    await waitFor(() => {
      expect(screen.getByTestId('proposed-change')).toBeInTheDocument();
    });
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('proposed-change')).toBeNull();
    });
    expect(textarea.value).toBe('Hello world');
  });

  it('clears text when Clear button is clicked', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(
      /Type or paste your text/i
    ) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Hello world');
    expect(textarea.value).toBe('Hello world');

    const clearButton = screen.getByRole('button', { name: /Clear/i });
    userEvent.click(clearButton);
    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });
});
