import React from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { TypingOverlay } from './TypingOverlay';
import { WordState } from '#root/hooks/useTypingEngine';

const makeWordState = (word: string, status: WordState['status'] = 'pending'): WordState => ({
  word,
  letters: word.split('').map((char) => ({ char, status: 'pending' as const })),
  status,
});

const defaultProps = {
  wordStates: [makeWordState('hello', 'active'), makeWordState('world')],
  currentWordIndex: 0,
  hasError: false,
  isStarted: false,
  isComplete: false,
  handleInput: jest.fn(),
  handleKeyDown: jest.fn(),
  currentInput: '',
};

describe('TypingOverlay', () => {
  test('renders the word display', () => {
    render(<TypingOverlay {...defaultProps} />);
    expect(screen.getByTestId('word-display')).toBeInTheDocument();
  });

  test('renders all word characters', () => {
    render(<TypingOverlay {...defaultProps} />);
    const display = screen.getByTestId('word-display');
    expect(display).toHaveTextContent('hello');
    expect(display).toHaveTextContent('world');
  });

  test('renders the hidden input', () => {
    render(<TypingOverlay {...defaultProps} />);
    expect(screen.getByTestId('typing-input')).toBeInTheDocument();
  });

  test('data-wordstotype contains the word list', () => {
    render(<TypingOverlay {...defaultProps} />);
    expect(screen.getByTestId('typing-input')).toHaveAttribute('data-wordstotype', 'hello world');
  });

  test('shows start hint when not yet started', () => {
    render(<TypingOverlay {...defaultProps} isStarted={false} />);
    expect(screen.getByText(/begin transmission/i)).toBeInTheDocument();
  });

  test('hides start hint once started', () => {
    render(<TypingOverlay {...defaultProps} isStarted={true} />);
    expect(screen.queryByText(/begin transmission/i)).not.toBeInTheDocument();
  });

  test('calls handleInput when input value changes', () => {
    const handleInput = jest.fn();
    render(<TypingOverlay {...defaultProps} handleInput={handleInput} />);
    fireEvent.change(screen.getByTestId('typing-input'), { target: { value: 'h' } });
    expect(handleInput).toHaveBeenCalledTimes(1);
  });

  test('calls handleKeyDown on keydown', () => {
    const handleKeyDown = jest.fn();
    render(<TypingOverlay {...defaultProps} handleKeyDown={handleKeyDown} />);
    fireEvent.keyDown(screen.getByTestId('typing-input'), { key: ' ' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  test('paste is prevented', () => {
    render(<TypingOverlay {...defaultProps} />);
    const input = screen.getByTestId('typing-input');
    const pasteEvent = createEvent.paste(input);
    fireEvent(input, pasteEvent);
    expect(pasteEvent.defaultPrevented).toBe(true);
  });

  test('input is focused on mount', () => {
    render(<TypingOverlay {...defaultProps} />);
    expect(screen.getByTestId('typing-input')).toHaveFocus();
  });

  test('clicking the overlay focuses the input', () => {
    render(<TypingOverlay {...defaultProps} />);
    const input = screen.getByTestId('typing-input');
    input.blur();
    fireEvent.click(document.body);
    // Click the overlay container (parent of the plaque)
    fireEvent.click(input.parentElement!);
    expect(input).toHaveFocus();
  });

  test('reflects currentInput value in the input field', () => {
    render(<TypingOverlay {...defaultProps} currentInput="hel" />);
    expect(screen.getByTestId('typing-input')).toHaveValue('hel');
  });
});
