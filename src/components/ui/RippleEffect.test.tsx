import React from 'react';
import { render, act } from '@testing-library/react';
import { RippleEffect } from './RippleEffect';
import { CompletedWordEvent } from '#root/hooks/useTypingEngine';

const makeEvent = (correct: boolean, timestamp = Date.now()): CompletedWordEvent => ({
  index: 0,
  correct,
  timestamp,
  screenX: 100,
  screenY: 200,
});

describe('RippleEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders nothing when event is null', () => {
    const { container } = render(<RippleEffect event={null} />);
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(0);
  });

  test('creates a ripple when a new event fires', () => {
    const { container, rerender } = render(<RippleEffect event={null} />);
    rerender(<RippleEffect event={makeEvent(true)} />);
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(1);
  });

  test('removes the ripple after 750ms', () => {
    const { container, rerender } = render(<RippleEffect event={null} />);
    rerender(<RippleEffect event={makeEvent(true)} />);
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(1);
    act(() => {
      jest.advanceTimersByTime(750);
    });
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(0);
  });

  test('ripple is still present before 750ms elapses', () => {
    const { container, rerender } = render(<RippleEffect event={null} />);
    rerender(<RippleEffect event={makeEvent(true)} />);
    act(() => {
      jest.advanceTimersByTime(749);
    });
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(1);
  });

  test('does not create a duplicate ripple for the same timestamp', () => {
    const event = makeEvent(true, 99999);
    const { container, rerender } = render(<RippleEffect event={event} />);
    rerender(<RippleEffect event={event} />);
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(1);
  });

  test('creates a new ripple when a new event with a different timestamp fires', () => {
    const { container, rerender } = render(<RippleEffect event={makeEvent(true, 1000)} />);
    rerender(<RippleEffect event={makeEvent(true, 2000)} />);
    // Two ripples: one from initial render, one from rerender
    expect(container.querySelectorAll('.ripple-ring')).toHaveLength(2);
  });

  test('correct ripple uses cyan border color', () => {
    const { container, rerender } = render(<RippleEffect event={null} />);
    rerender(<RippleEffect event={makeEvent(true)} />);
    const ripple = container.querySelector('.ripple-ring') as HTMLElement;
    expect(ripple.style.cssText).toContain('var(--color-cyan)');
  });

  test('incorrect ripple uses red border color', () => {
    const { container, rerender } = render(<RippleEffect event={null} />);
    rerender(<RippleEffect event={makeEvent(false)} />);
    const ripple = container.querySelector('.ripple-ring') as HTMLElement;
    expect(ripple.style.cssText).toContain('var(--color-red)');
  });
});
