import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react";

const useLockedInput = (wordList: Array<string>) => {
  const [userInput, setUserInput] = useState("");
  const [skippedWords, setSkippedWords] = useState<Array<string>>([]);
  const [frozenWordsArray, setFrozenWordsArray] = useState<Array<string>>([]);

  const userInputArray = useMemo(() => [...frozenWordsArray, ...userInput.split(" ")], [userInput, frozenWordsArray]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.includes("Arrow")) {
      event.preventDefault();
    }
    if (event.key === " ") {
      if (userInputArray[userInputArray.length - 1] === "") {
        event.preventDefault();
      }
      if (userInputArray[userInputArray.length - 1] === wordList[userInputArray.length - 1]) {
        event.preventDefault();
        setFrozenWordsArray((prevWordsArr) => [...prevWordsArr, ...userInput.split(" ")]);
        setUserInput("");
        if (skippedWords.includes(userInputArray[userInputArray.length - 1])) {
          setSkippedWords(skippedWords.filter((word) => word !== userInputArray[userInputArray.length - 1]));
        }
      } else {
        setSkippedWords([...skippedWords, wordList[userInputArray.length - 1]]);
      }
    }
  };

  return {
    handleChange,
    handleKeyDown,
    userInput,
    userInputArray,
    skippedWords,
  };
};

export default useLockedInput;
