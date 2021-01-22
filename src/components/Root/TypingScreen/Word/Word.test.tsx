import React from "react";
import { render, screen } from "@testing-library/react";

import Word, { CORRECT_COLOR, WRONG_COLOR, PLACEHOLDER_COLOR } from "./Word";

describe("Word", () => {
  test("renders letters of the word", () => {
    const word = "abcd";

    render(<Word>{word}</Word>);

    const letter1 = screen.getByText(word[0]);
    const letter2 = screen.getByText(word[1]);
    const letter3 = screen.getByText(word[2]);
    const letter4 = screen.getByText(word[3]);

    expect(letter1).toBeInTheDocument();
    expect(letter2).toBeInTheDocument();
    expect(letter3).toBeInTheDocument();
    expect(letter4).toBeInTheDocument();
  });

  test("placeholder letters are correct color", () => {
    const word = "abcd";

    render(<Word userValue={""}>{word}</Word>);

    const letter1 = screen.getByText(word[0]);
    const letter2 = screen.getByText(word[1]);
    const letter3 = screen.getByText(word[2]);
    const letter4 = screen.getByText(word[3]);

    expect(letter1).toBeInTheDocument();
    expect(letter2).toBeInTheDocument();
    expect(letter3).toBeInTheDocument();
    expect(letter4).toBeInTheDocument();

    expect(window.getComputedStyle(letter1).color).toBe(PLACEHOLDER_COLOR);
    expect(window.getComputedStyle(letter2).color).toBe(PLACEHOLDER_COLOR);
    expect(window.getComputedStyle(letter3).color).toBe(PLACEHOLDER_COLOR);
    expect(window.getComputedStyle(letter4).color).toBe(PLACEHOLDER_COLOR);
  });

  test("correct letters are correct color", () => {
    const word = "abcd";

    render(<Word userValue={word}>{word}</Word>);

    const letter1 = screen.getByText(word[0]);
    const letter2 = screen.getByText(word[1]);
    const letter3 = screen.getByText(word[2]);
    const letter4 = screen.getByText(word[3]);

    expect(letter1).toBeInTheDocument();
    expect(letter2).toBeInTheDocument();
    expect(letter3).toBeInTheDocument();
    expect(letter4).toBeInTheDocument();

    expect(window.getComputedStyle(letter1).color).toBe(CORRECT_COLOR);
    expect(window.getComputedStyle(letter2).color).toBe(CORRECT_COLOR);
    expect(window.getComputedStyle(letter3).color).toBe(CORRECT_COLOR);
    expect(window.getComputedStyle(letter4).color).toBe(CORRECT_COLOR);
  });

  test("wrong letters are correct color", () => {
    const word = "abcd";

    render(<Word userValue={"hihi"}>{word}</Word>);

    const letter1 = screen.getByText(word[0]);
    const letter2 = screen.getByText(word[1]);
    const letter3 = screen.getByText(word[2]);
    const letter4 = screen.getByText(word[3]);

    expect(letter1).toBeInTheDocument();
    expect(letter2).toBeInTheDocument();
    expect(letter3).toBeInTheDocument();
    expect(letter4).toBeInTheDocument();

    expect(window.getComputedStyle(letter1).color).toBe(WRONG_COLOR);
    expect(window.getComputedStyle(letter2).color).toBe(WRONG_COLOR);
    expect(window.getComputedStyle(letter3).color).toBe(WRONG_COLOR);
    expect(window.getComputedStyle(letter4).color).toBe(WRONG_COLOR);
  });
});
