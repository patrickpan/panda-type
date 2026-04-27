import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResultScreen } from './ResultScreen';

const defaultProps = {
  wpm: 75,
  rawWpm: 82,
  accuracy: 94,
  timeTaken: 45,
  onRetry: jest.fn(),
};

describe('ResultScreen', () => {
  test('renders the WPM value', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByTestId('result-wpm')).toHaveTextContent('75');
  });

  test('renders the raw WPM value', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByTestId('result-raw-wpm')).toHaveTextContent('82');
  });

  test('renders the accuracy value', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByTestId('result-accuracy')).toHaveTextContent('94');
  });

  test('renders time in seconds when under one minute', () => {
    render(<ResultScreen {...defaultProps} timeTaken={45} />);
    expect(screen.getByTestId('result-time')).toHaveTextContent('45s');
  });

  test('renders time with minutes when 60 seconds or more', () => {
    render(<ResultScreen {...defaultProps} timeTaken={90} />);
    expect(screen.getByTestId('result-time')).toHaveTextContent('1m 30s');
  });

  test('renders time as exactly 60s as "1m 0s"', () => {
    render(<ResultScreen {...defaultProps} timeTaken={60} />);
    expect(screen.getByTestId('result-time')).toHaveTextContent('1m 0s');
  });

  test('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    render(<ResultScreen {...defaultProps} onRetry={onRetry} />);
    fireEvent.click(screen.getByText(/TEST AGAIN/i));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('renders stat labels', () => {
    render(<ResultScreen {...defaultProps} />);
    expect(screen.getByText('WPM')).toBeInTheDocument();
    expect(screen.getByText('RAW WPM')).toBeInTheDocument();
    expect(screen.getByText('ACCURACY')).toBeInTheDocument();
    expect(screen.getByText('TIME')).toBeInTheDocument();
  });
});
