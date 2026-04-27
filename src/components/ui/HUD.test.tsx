import React from 'react';
import { render, screen } from '@testing-library/react';
import { HUD } from './HUD';

const defaultProps = {
  wpm: 60,
  rawWpm: 65,
  accuracy: 97,
  timeElapsed: 30,
  wordIndex: 5,
  totalWords: 30,
  isStarted: true,
  isComplete: false,
};

describe('HUD', () => {
  test('always renders the title', () => {
    render(<HUD {...defaultProps} isStarted={false} />);
    expect(screen.getByText(/PANDA TYPE/i)).toBeInTheDocument();
  });

  test('shows sector label when started', () => {
    render(<HUD {...defaultProps} isStarted={true} />);
    expect(screen.getByText(/SECTOR/)).toBeInTheDocument();
  });

  test('hides sector label when not started', () => {
    render(<HUD {...defaultProps} isStarted={false} />);
    expect(screen.queryByText(/SECTOR/)).not.toBeInTheDocument();
  });

  test('sector displays wordIndex + 1', () => {
    render(<HUD {...defaultProps} isStarted={true} wordIndex={4} totalWords={30} />);
    expect(screen.getByText(/SECTOR 5 \/ 30/)).toBeInTheDocument();
  });

  test('sector does not exceed totalWords', () => {
    render(<HUD {...defaultProps} isStarted={true} wordIndex={30} totalWords={30} />);
    expect(screen.getByText(/SECTOR 30 \/ 30/)).toBeInTheDocument();
  });

  test('shows stats bar when started and not complete', () => {
    render(<HUD {...defaultProps} isStarted={true} isComplete={false} />);
    expect(screen.getByText('WPM')).toBeInTheDocument();
    expect(screen.getByText('RAW')).toBeInTheDocument();
    expect(screen.getByText('ACC')).toBeInTheDocument();
    expect(screen.getByText('TIME')).toBeInTheDocument();
  });

  test('hides stats bar when session is complete', () => {
    render(<HUD {...defaultProps} isStarted={true} isComplete={true} />);
    expect(screen.queryByText('WPM')).not.toBeInTheDocument();
  });

  test('hides stats bar when not started', () => {
    render(<HUD {...defaultProps} isStarted={false} isComplete={false} />);
    expect(screen.queryByText('WPM')).not.toBeInTheDocument();
  });

  test('formats time in seconds only when under one minute', () => {
    render(<HUD {...defaultProps} isStarted={true} timeElapsed={45} />);
    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  test('formats time with minutes when 60 seconds or more', () => {
    render(<HUD {...defaultProps} isStarted={true} timeElapsed={90} />);
    expect(screen.getByText('1m 30s')).toBeInTheDocument();
  });

  test('renders wpm and accuracy values', () => {
    render(<HUD {...defaultProps} isStarted={true} wpm={72} accuracy={98} />);
    expect(screen.getByText('72')).toBeInTheDocument();
    expect(screen.getByText('98')).toBeInTheDocument();
  });

  test('renders 0 instead of NaN for wpm', () => {
    render(<HUD {...defaultProps} isStarted={true} wpm={NaN} />);
    const statValues = screen.getAllByText('0');
    expect(statValues.length).toBeGreaterThan(0);
  });
});
