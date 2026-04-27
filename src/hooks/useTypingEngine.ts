import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generateWords } from '../data/wordList';

export type LetterStatus = 'pending' | 'correct' | 'wrong';

export interface LetterState {
  char: string;
  status: LetterStatus;
}

export interface WordState {
  word: string;
  letters: LetterState[];
  status: 'pending' | 'active' | 'correct' | 'wrong';
}

export interface CompletedWordEvent {
  index: number;
  correct: boolean;
  timestamp: number;
  screenX: number;
  screenY: number;
}

export interface ResultData {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeTaken: number;
}

export interface TypingEngineResult {
  words: string[];
  wordStates: WordState[];
  currentInput: string;
  currentWordIndex: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeElapsed: number;
  isStarted: boolean;
  isComplete: boolean;
  hasError: boolean;
  completedWordEvent: CompletedWordEvent | null;
  resultData: ResultData | null;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  reset: () => void;
}

const TOTAL_WORDS = 30;

function computeWordState(
  word: string,
  input: string,
  status: WordState['status']
): WordState {
  const letters: LetterState[] = word.split('').map((char, i) => {
    if (i >= input.length) return { char, status: 'pending' };
    return { char, status: input[i] === char ? 'correct' : 'wrong' };
  });
  return { word, letters, status };
}

export function useTypingEngine(): TypingEngineResult {
  const [words] = useState(() => generateWords(TOTAL_WORDS));
  const [currentInput, setCurrentInput] = useState('');
  const [completedInputs, setCompletedInputs] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [completedWordEvent, setCompletedWordEvent] = useState<CompletedWordEvent | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const startTime = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalKeys = useRef(0);
  const correctKeys = useRef(0);
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedInputsRef = useRef<string[]>([]);
  const wpmRef = useRef(0);

  const wordStates: WordState[] = useMemo(() => {
    return words.map((word, index) => {
      if (index < currentWordIndex) {
        const inp = completedInputs[index] ?? '';
        return computeWordState(word, inp, inp === word ? 'correct' : 'wrong');
      }
      if (index === currentWordIndex) {
        return computeWordState(word, currentInput, 'active');
      }
      return {
        word,
        letters: word.split('').map((char) => ({ char, status: 'pending' as const })),
        status: 'pending' as const,
      };
    });
  }, [words, currentWordIndex, currentInput, completedInputs]);

  useEffect(() => {
    if (!isStarted || isComplete) return;
    intervalRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTime.current!) / 1000;
      setTimeElapsed(elapsed);
      const correctWords = completedInputsRef.current.filter((inp, i) => inp === words[i]).length;
      const calculatedWpm = Math.round(correctWords / (elapsed / 60));
      const calculatedRaw = Math.round(completedInputsRef.current.length / (elapsed / 60));
      wpmRef.current = calculatedWpm;
      setWpm(calculatedWpm);
      setRawWpm(calculatedRaw);
      setAccuracy(
        totalKeys.current > 0
          ? Math.round((correctKeys.current / totalKeys.current) * 100)
          : 100
      );
    }, 400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted, isComplete, words]);

  const completeWord = useCallback(
    (cursorX: number, cursorY: number) => {
      const word = words[currentWordIndex];
      const isCorrect = currentInput === word;

      const newCompleted = [...completedInputsRef.current, currentInput];
      completedInputsRef.current = newCompleted;
      setCompletedInputs(newCompleted);
      setCompletedWordEvent({
        index: currentWordIndex,
        correct: isCorrect,
        timestamp: Date.now(),
        screenX: cursorX,
        screenY: cursorY,
      });

      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setCurrentInput('');

      if (nextIndex >= words.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsComplete(true);
        const elapsed = (performance.now() - startTime.current!) / 1000;
        const correctWords = newCompleted.filter((inp, i) => inp === words[i]).length;
        setResultData({
          wpm: Math.round(correctWords / (elapsed / 60)),
          rawWpm: Math.round(words.length / (elapsed / 60)),
          accuracy:
            totalKeys.current > 0
              ? Math.round((correctKeys.current / totalKeys.current) * 100)
              : 100,
          timeTaken: Math.round(elapsed),
        });
      }
    },
    [currentInput, currentWordIndex, words]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!isStarted && value.length > 0) {
        setIsStarted(true);
        startTime.current = performance.now();
      }

      if (value.endsWith(' ')) {
        const rect = e.target.getBoundingClientRect();
        completeWord(rect.left, rect.top);
        return;
      }

      const word = words[currentWordIndex];
      const lastChar = value[value.length - 1];
      if (lastChar) {
        totalKeys.current++;
        if (word[value.length - 1] === lastChar) {
          correctKeys.current++;
        } else {
          setHasError(true);
          if (errorTimeout.current) clearTimeout(errorTimeout.current);
          errorTimeout.current = setTimeout(() => setHasError(false), 350);
        }
      }

      // End session immediately when the last letter of the last word is typed
      const isLastWord = currentWordIndex === words.length - 1;
      if (isLastWord && value.length === word.length) {
        const rect = e.target.getBoundingClientRect();
        completeWord(rect.left, rect.top);
        return;
      }

      setCurrentInput(value);
    },
    [isStarted, words, currentWordIndex, completeWord]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (currentInput.length > 0) {
          const target = e.target as HTMLInputElement;
          const rect = target.getBoundingClientRect();
          completeWord(rect.left, rect.top);
        }
      }
      if (e.key === 'Backspace' && currentInput.length === 0) {
        e.preventDefault();
      }
    },
    [currentInput, completeWord]
  );

  const reset = useCallback(() => {
    setCurrentInput('');
    setCompletedInputs([]);
    completedInputsRef.current = [];
    setCurrentWordIndex(0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setTimeElapsed(0);
    setIsStarted(false);
    setIsComplete(false);
    setHasError(false);
    setCompletedWordEvent(null);
    setResultData(null);
    startTime.current = null;
    totalKeys.current = 0;
    correctKeys.current = 0;
    wpmRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return {
    words,
    wordStates,
    currentInput,
    currentWordIndex,
    wpm,
    rawWpm,
    accuracy,
    timeElapsed,
    isStarted,
    isComplete,
    hasError,
    completedWordEvent,
    resultData,
    handleInput,
    handleKeyDown,
    reset,
  };
}
