import { useRef, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { WordState, LetterStatus } from "#root/hooks/useTypingEngine";

export interface TypingOverlayProps {
  wordStates: WordState[];
  currentWordIndex: number;
  hasError: boolean;
  isStarted: boolean;
  isComplete: boolean;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  currentInput: string;
}

const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

const LetterWrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const CursorBar = styled.span`
  position: absolute;
  left: -1px;
  top: 0.05em;
  bottom: 0.05em;
  width: 2px;
  background: #00ffcc;
  box-shadow:
    0 0 8px #00ffcc,
    0 0 20px rgba(0, 255, 204, 0.6);
  border-radius: 1px;
  animation: ${cursorBlink} 1s ease-in-out infinite;
`;

const LetterChar = styled.span<{ $status: LetterStatus }>`
  color: ${({ $status }) =>
    $status === "correct" ? "#00ffcc" : $status === "wrong" ? "#ff4455" : "rgba(120, 160, 185, 0.38)"};
  text-shadow: ${({ $status }) =>
    $status === "correct"
      ? "0 0 6px #00ffcc, 0 0 18px rgba(0,255,204,0.5), 0 0 40px rgba(0,255,180,0.2)"
      : $status === "wrong"
        ? "0 0 6px rgba(255, 60, 60, 0.4)"
        : "none"};
  transition:
    color 0.05s ease,
    text-shadow 0.12s ease;
`;

const WordSpan = styled.span`
  display: inline-block;
  margin-right: 0.6em;
  margin-bottom: 0.3em;
  position: relative;
`;

const TrailingCursorHost = styled.span`
  display: inline-block;
  position: relative;
  width: 0;
`;

const TrailingCursor = styled(CursorBar)`
  left: 0;
  box-shadow: 0 0 8px #00ffcc;
`;

const Corner = styled.span`
  position: absolute;
  width: 14px;
  height: 14px;
  border-style: solid;
  border-color: rgba(0, 255, 204, 0.7);
  border-width: 0;
`;
const CornerTL = styled(Corner)`
  top: -1px;
  left: -1px;
  border-top-width: 2px;
  border-left-width: 2px;
`;
const CornerTR = styled(Corner)`
  top: -1px;
  right: -1px;
  border-top-width: 2px;
  border-right-width: 2px;
`;
const CornerBL = styled(Corner)`
  bottom: -1px;
  left: -1px;
  border-bottom-width: 2px;
  border-left-width: 2px;
`;
const CornerBR = styled(Corner)`
  bottom: -1px;
  right: -1px;
  border-bottom-width: 2px;
  border-right-width: 2px;
`;

const Scanline = styled.div`
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 255, 204, 0.015) 3px,
    rgba(0, 255, 204, 0.015) 4px
  );
  pointer-events: none;
  border-radius: 4px;
`;

const Plaque = styled(motion.div)`
  position: relative;
  width: min(780px, 90vw);
  padding: 28px 36px;
  background: rgba(0, 14, 36, 0.72);
  border: 1px solid rgba(0, 255, 204, 0.22);
  border-radius: 4px;
  backdrop-filter: blur(12px);
  box-shadow:
    0 0 0 1px rgba(0, 255, 204, 0.06),
    inset 0 0 40px rgba(0, 20, 50, 0.6),
    0 4px 60px rgba(0, 0, 0, 0.6);
  user-select: none;
`;

const WordDisplay = styled.div.attrs({ "data-testid": "word-display" })`
  font-family: var(--font-mono);
  font-size: clamp(16px, 2.2vw, 22px);
  line-height: 1.95;
  position: relative;
  z-index: 1;
`;

const Overlay = styled.div<{ $isComplete: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: ${({ $isComplete }) => ($isComplete ? "none" : "auto")};
`;

const StartHint = styled(motion.div)`
  font-family: var(--font-display);
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  color: rgba(0, 255, 204, 0.3);
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`;

function Letter({ char, status, isCursor }: { char: string; status: LetterStatus; isCursor: boolean }) {
  return (
    <LetterWrapper>
      {isCursor && <CursorBar />}
      <LetterChar $status={status}>{char}</LetterChar>
    </LetterWrapper>
  );
}

function Word({
  wordState,
  isActive,
  currentInput,
}: {
  wordState: WordState;
  isActive: boolean;
  currentInput: string;
}) {
  return (
    <WordSpan>
      {wordState.letters.map((letter, li) => (
        <Letter key={li} char={letter.char} status={letter.status} isCursor={isActive && li === currentInput.length} />
      ))}
      {isActive && currentInput.length >= wordState.word.length && (
        <TrailingCursorHost>
          <TrailingCursor />
        </TrailingCursorHost>
      )}
    </WordSpan>
  );
}

export function TypingOverlay({
  wordStates,
  currentWordIndex,
  hasError,
  isStarted,
  isComplete,
  handleInput,
  handleKeyDown,
  currentInput,
}: TypingOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Overlay $isComplete={isComplete} onClick={focusInput}>
      <AnimatePresence>
        {!isStarted && (
          <StartHint initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            ▶ begin transmission — start typing
          </StartHint>
        )}
      </AnimatePresence>

      <Plaque className={hasError ? "chroma-error" : ""} key={hasError ? "error" : "normal"}>
        <CornerTL />
        <CornerTR />
        <CornerBL />
        <CornerBR />
        <Scanline />
        <WordDisplay>
          {wordStates.map((ws, wi) => (
            <Word
              key={wi}
              wordState={ws}
              isActive={wi === currentWordIndex}
              currentInput={wi === currentWordIndex ? currentInput : ""}
            />
          ))}
        </WordDisplay>
      </Plaque>

      <HiddenInput
        ref={inputRef}
        data-testid="typing-input"
        data-wordstotype={wordStates.map((ws) => ws.word).join(" ")}
        value={currentInput}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={(e) => e.preventDefault()}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </Overlay>
  );
}
