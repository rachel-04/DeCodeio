import React from 'react';

function Keyboard({ onKeyPress, onBackspace, usedLetters }) {
  const rows = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM',
  ];

  const getKeyColor = (letter) => {
    if (usedLetters[letter]) {
      switch (usedLetters[letter]) {
        case 'green':
          return '#4CAF50';
        case 'yellow':
          return '#FFEB3B';
        case 'gray':
          return '#ccc';
        default:
          return '#eee';
      }
    }
    return '#eee'; // Default color for unused letters
  };

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.split('').map((letter) => (
            <button
              key={letter}
              onClick={() => onKeyPress(letter.toLowerCase())}
              className="key"
              style={{ backgroundColor: getKeyColor(letter.toLowerCase()) }}
            >
              {letter}
            </button>
          ))}
          {rowIndex === rows.length - 1 && (
            <button onClick={onBackspace} className="key">⌫</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
