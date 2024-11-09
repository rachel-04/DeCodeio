import React, { useState, useEffect } from 'react';
import './App.css';
import Keyboard from './Keyboard';
import laWords from './Dicts/La.json';
import taWords from './Dicts/Ta.json';

function getRandomWord() {
  return laWords[Math.floor(Math.random() * laWords.length)];
}

const validWords = [...laWords, ...taWords];
const isValidGuess = (guess) => validWords.includes(guess.toLowerCase());

function App() {
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState('');
  const [usedLetters, setUsedLetters] = useState({});

  const handleKeyPress = (letter) => {
    if (status !== '' && currentGuess.length === 0) {
      setStatus(''); // Reset status when starting to type a new word
    }

    if (currentGuess.length < 5 && status === '') {
      setCurrentGuess((prevGuess) => prevGuess + letter.toUpperCase());
    }
  };

  const handleBackspace = () => {
    setCurrentGuess((prevGuess) => {
      const updatedGuess = prevGuess.slice(0, -1);
      if (updatedGuess.length === 0 && status === 'Not a valid word') {
        setStatus(''); // Reset status if all letters are deleted after an invalid word
      }
      return updatedGuess;
    });
  };

  const handleSubmit = () => {
    if (currentGuess.length === 5) {
      if (!isValidGuess(currentGuess)) {
        setStatus('Not a valid word');
        return;
      }

      const updatedGuesses = [...guesses];
      updatedGuesses[attempt] = currentGuess;
      setGuesses(updatedGuesses);
      setAttempt(attempt + 1);

      const newUsedLetters = { ...usedLetters };

      // Update usedLetters based on the color status from getCellColor
      for (let i = 0; i < 5; i++) {
        const letter = currentGuess[i].toLowerCase();
        const color = getCellColor(currentGuess, i);
        
        // Priority: if the letter is green, it should override yellow or gray
        if (color === '#4CAF50') { // Green
          newUsedLetters[letter] = 'green';
        } else if (color === '#FFEB3B' && newUsedLetters[letter] !== 'green') { // Yellow
          newUsedLetters[letter] = 'yellow';
        } else if (!newUsedLetters[letter]) { // Gray (only set if not already yellow or green)
          newUsedLetters[letter] = 'gray';
        }
      }

      setUsedLetters(newUsedLetters); // Update the state with new letter colors

      if (currentGuess === targetWord) {
        setStatus('You Won!');
      } else if (attempt === 5) {
        setStatus(`Game Over! The word was ${targetWord}`);
      } else {
        setStatus(''); // Reset status after a successful guess
      }

      // Clear the current guess only after evaluating
      setCurrentGuess('');
    }
  };

  const handleReset = () => {
    setTargetWord(getRandomWord());
    setGuesses(Array(6).fill(''));
    setCurrentGuess('');
    setAttempt(0);
    setStatus('');
    setUsedLetters({}); // Reset used letters
  };

  const getCellColor = (guess, index) => {
    if (!guess || !targetWord) return '#ddd';

    const targetArray = targetWord.toLowerCase().split('');
    const guessArray = guess.toLowerCase().split('');
    const exactMatches = Array(5).fill(false);
    const targetUsed = Array(5).fill(false);

    // First pass: Mark all exact (green) matches
    for (let i = 0; i < 5; i++) {
      if (guessArray[i] === targetArray[i]) {
        exactMatches[i] = true;
        targetUsed[i] = true; // Mark the target letter as used for green
      }
    }

    // Second pass: Check for yellow matches without double-counting
    if (exactMatches[index]) {
      return '#4CAF50'; // Green for correct position
    } else if (targetArray.includes(guessArray[index])) {
      for (let j = 0; j < 5; j++) {
        // Only mark as yellow if:
        // - It's the same letter
        // - It's not already used for green
        // - It hasn't been used for yellow yet
        if (targetArray[j] === guessArray[index] && !targetUsed[j]) {
          targetUsed[j] = true; // Mark this position as used for yellow
          return '#FFEB3B'; // Yellow for correct letter, wrong position
        }
      }
    }

    // If no match, return gray
    return '#ccc';
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (status === 'You Won!' || status.startsWith('Game Over')) return;

      if (event.key === "Enter" && currentGuess.length === 5) {
        handleSubmit();
      } else if (event.key === "Backspace") {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
        handleKeyPress(event.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentGuess, status]);

  return (
    <div className="App">
      <h1>DeCodeio</h1>
      <div className="grid">
        {guesses.map((guess, rowIndex) => (
          <div key={rowIndex} className="row">
            {[...Array(5)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="cell"
                style={{
                  backgroundColor:
                    rowIndex < attempt ? getCellColor(guess, colIndex) : '#ddd'
                }}
              >
                {(rowIndex === attempt ? currentGuess : guess)[colIndex] || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Keyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} usedLetters={usedLetters} />

      <div className="controls">
        <button onClick={handleSubmit} disabled={currentGuess.length < 5}>
          Submit
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {status && <div className="status">{status}</div>}
    </div>
  );
}

export default App;
