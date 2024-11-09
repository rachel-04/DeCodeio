const fs = require('fs');

// Read words from the text file
const words = fs.readFileSync('src/Dicts/wordle-Ta.txt', 'utf-8')
  .split('\n') // Split by new line
  .map(word => word.trim()) // Trim whitespace
  .filter(word => word.length > 0); // Remove any empty lines

console.log(words); // Print words to check if they are loaded correctly

// Write words to JSON format in words.json
fs.writeFileSync('words.json', JSON.stringify(words, null, 2));

console.log('Word list has been converted to JSON and saved as words.json');
