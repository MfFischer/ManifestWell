/**
 * Quick batch test of YouTube URLs
 */
const fs = require('fs');
const path = require('path');

const libraryPath = path.join(__dirname, '..', 'src', 'content', 'meditations', 'library.ts');
const content = fs.readFileSync(libraryPath, 'utf8');

const urlRegex = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/g;
const videoIds = new Set();
let match;

while ((match = urlRegex.exec(content)) !== null) {
  videoIds.add(match[1]);
}

console.log('Unique video IDs to verify:');
console.log(JSON.stringify([...videoIds], null, 2));
console.log(`\nTotal: ${videoIds.size} unique videos`);

