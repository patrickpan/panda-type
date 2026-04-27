import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useTypingEngine } from './useTypingEngine';

function makeInputEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return {
    target: {
      value,
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    },
  } as unknown as React.ChangeEvent<HTMLInputElement>;
}

function makeKeyEvent(key: string): React.KeyboardEvent<HTMLInputElement> {
  return {
    key,
    preventDefault: jest.fn(),
    target: {
      getBoundingClientRect: () => ({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    },
  } as unknown as React.KeyboardEvent<HTMLInputElement>;
}

/** Types a word into the hook character by character. */
function typeWord(result: ReturnType<typeof renderHook<unknown, ReturnType<typeof useTypingEngine>>>['result'], word: string) {
  for (const char of word) {
    act(() => {
      result.current.handleInput(makeInputEvent(result.current.currentInput + char));
    });
  }
}

/** Types a word then presses space to advance to the next word. */
function typeWordAndAdvance(result: ReturnType<typeof renderHook<unknown, ReturnType<typeof useTypingEngine>>>['result'], word: string) {
  typeWord(result, word);
  act(() => {
    result.current.handleKeyDown(makeKeyEvent(' '));
  });
}

describe('useTypingEngine', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('initial state', () => {
    test('is not started, not complete, no error', () => {
      const { result } = renderHook(() => useTypingEngine());
      expect(result.current.isStarted).toBe(false);
      expect(result.current.isComplete).toBe(false);
      expect(result.current.hasError).toBe(false);
    });

    test('has empty input and word index at 0', () => {
      const { result } = renderHook(() => useTypingEngine());
      expect(result.current.currentInput).toBe('');
      expect(result.current.currentWordIndex).toBe(0);
    });

    test('starts with 100 accuracy and 0 wpm', () => {
      const { result } = renderHook(() => useTypingEngine());
      expect(result.current.accuracy).toBe(100);
      expect(result.current.wpm).toBe(0);
      expect(result.current.rawWpm).toBe(0);
    });

    test('has null resultData and completedWordEvent', () => {
      const { result } = renderHook(() => useTypingEngine());
      expect(result.current.resultData).toBeNull();
      expect(result.current.completedWordEvent).toBeNull();
    });

    test('generates 30 words', () => {
      const { result } = renderHook(() => useTypingEngine());
      expect(result.current.words).toHaveLength(30);
    });

    test('first wordState starts as active, rest as pending', () => {
      const { result } = renderHook(() => useTypingEngine());
      expect(result.current.wordStates[0].status).toBe('active');
      result.current.wordStates.slice(1).forEach((ws) => {
        expect(ws.status).toBe('pending');
      });
      // All letters start pending
      result.current.wordStates.forEach((ws) => {
        ws.letters.forEach((l) => expect(l.status).toBe('pending'));
      });
    });
  });

  describe('session start', () => {
    test('starts on first non-empty input', () => {
      const { result } = renderHook(() => useTypingEngine());
      act(() => {
        result.current.handleInput(makeInputEvent('a'));
      });
      expect(result.current.isStarted).toBe(true);
    });

    test('does not start on empty input', () => {
      const { result } = renderHook(() => useTypingEngine());
      act(() => {
        result.current.handleInput(makeInputEvent(''));
      });
      expect(result.current.isStarted).toBe(false);
    });
  });

  describe('typing input', () => {
    test('updates currentInput as characters are typed', () => {
      const { result } = renderHook(() => useTypingEngine());
      act(() => {
        result.current.handleInput(makeInputEvent('ab'));
      });
      expect(result.current.currentInput).toBe('ab');
    });

    test('marks correct letter as correct in wordStates', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      act(() => {
        result.current.handleInput(makeInputEvent(firstWord[0]));
      });
      expect(result.current.wordStates[0].letters[0].status).toBe('correct');
    });

    test('marks wrong letter as wrong in wordStates', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      const wrongChar = firstWord[0] === 'z' ? 'a' : 'z';
      act(() => {
        result.current.handleInput(makeInputEvent(wrongChar));
      });
      expect(result.current.wordStates[0].letters[0].status).toBe('wrong');
    });

    test('sets hasError on wrong letter', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      const wrongChar = firstWord[0] === 'z' ? 'a' : 'z';
      act(() => {
        result.current.handleInput(makeInputEvent(wrongChar));
      });
      expect(result.current.hasError).toBe(true);
    });

    test('hasError clears after 350ms', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      const wrongChar = firstWord[0] === 'z' ? 'a' : 'z';
      act(() => {
        result.current.handleInput(makeInputEvent(wrongChar));
      });
      expect(result.current.hasError).toBe(true);
      act(() => {
        jest.advanceTimersByTime(350);
      });
      expect(result.current.hasError).toBe(false);
    });

    test('letters after current input remain pending', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      if (firstWord.length < 2) return; // skip single-char words
      act(() => {
        result.current.handleInput(makeInputEvent(firstWord[0]));
      });
      expect(result.current.wordStates[0].letters[1].status).toBe('pending');
    });
  });

  describe('word advancement', () => {
    test('space suffix in handleInput advances to next word', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      typeWord(result, firstWord);
      act(() => {
        result.current.handleInput(makeInputEvent(result.current.currentInput + ' '));
      });
      expect(result.current.currentWordIndex).toBe(1);
      expect(result.current.currentInput).toBe('');
    });

    test('space key in handleKeyDown advances word when input is non-empty', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      typeWord(result, firstWord);
      act(() => {
        result.current.handleKeyDown(makeKeyEvent(' '));
      });
      expect(result.current.currentWordIndex).toBe(1);
      expect(result.current.currentInput).toBe('');
    });

    test('space key does not advance when input is empty', () => {
      const { result } = renderHook(() => useTypingEngine());
      act(() => {
        result.current.handleKeyDown(makeKeyEvent(' '));
      });
      expect(result.current.currentWordIndex).toBe(0);
    });

    test('correctly typed word is marked correct after advancing', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      typeWordAndAdvance(result, firstWord);
      expect(result.current.wordStates[0].status).toBe('correct');
    });

    test('incorrectly typed word is marked wrong after advancing', () => {
      const { result } = renderHook(() => useTypingEngine());
      const wrongChar = result.current.words[0][0] === 'z' ? 'a' : 'z';
      act(() => {
        result.current.handleInput(makeInputEvent(wrongChar));
      });
      act(() => {
        result.current.handleKeyDown(makeKeyEvent(' '));
      });
      expect(result.current.wordStates[0].status).toBe('wrong');
    });

    test('fires completedWordEvent when word is advanced', () => {
      const { result } = renderHook(() => useTypingEngine());
      const firstWord = result.current.words[0];
      typeWordAndAdvance(result, firstWord);
      expect(result.current.completedWordEvent).not.toBeNull();
      expect(result.current.completedWordEvent?.index).toBe(0);
    });
  });

  describe('backspace behavior', () => {
    test('backspace at word start calls preventDefault', () => {
      const { result } = renderHook(() => useTypingEngine());
      const event = makeKeyEvent('Backspace');
      act(() => {
        result.current.handleKeyDown(event);
      });
      expect((event as any).preventDefault).toHaveBeenCalled();
    });

    test('backspace mid-word does not call preventDefault', () => {
      const { result } = renderHook(() => useTypingEngine());
      act(() => {
        result.current.handleInput(makeInputEvent('a'));
      });
      const event = makeKeyEvent('Backspace');
      act(() => {
        result.current.handleKeyDown(event);
      });
      expect((event as any).preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('session completion', () => {
    test('completes when last letter of last word is typed (no space required)', () => {
      const { result } = renderHook(() => useTypingEngine());
      const words = result.current.words;

      for (let i = 0; i < words.length - 1; i++) {
        typeWordAndAdvance(result, words[i]);
      }

      expect(result.current.currentWordIndex).toBe(words.length - 1);
      expect(result.current.isComplete).toBe(false);

      const lastWord = words[words.length - 1];
      for (let j = 0; j < lastWord.length - 1; j++) {
        act(() => {
          result.current.handleInput(makeInputEvent(result.current.currentInput + lastWord[j]));
        });
      }
      expect(result.current.isComplete).toBe(false);

      act(() => {
        result.current.handleInput(
          makeInputEvent(result.current.currentInput + lastWord[lastWord.length - 1])
        );
      });

      expect(result.current.isComplete).toBe(true);
    });

    test('populates resultData with numeric fields after completion', () => {
      const { result } = renderHook(() => useTypingEngine());
      const words = result.current.words;

      for (let i = 0; i < words.length - 1; i++) {
        typeWordAndAdvance(result, words[i]);
      }
      typeWord(result, words[words.length - 1]);

      expect(result.current.resultData).toMatchObject({
        wpm: expect.any(Number),
        rawWpm: expect.any(Number),
        accuracy: expect.any(Number),
        timeTaken: expect.any(Number),
      });
    });
  });

  describe('reset', () => {
    test('returns all state to initial values', () => {
      const { result } = renderHook(() => useTypingEngine());
      act(() => {
        result.current.handleInput(makeInputEvent('a'));
      });
      expect(result.current.isStarted).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isStarted).toBe(false);
      expect(result.current.isComplete).toBe(false);
      expect(result.current.currentInput).toBe('');
      expect(result.current.currentWordIndex).toBe(0);
      expect(result.current.wpm).toBe(0);
      expect(result.current.rawWpm).toBe(0);
      expect(result.current.accuracy).toBe(100);
      expect(result.current.hasError).toBe(false);
      expect(result.current.resultData).toBeNull();
      expect(result.current.completedWordEvent).toBeNull();
    });
  });
});
