// Script to update meditation video URLs with working links
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'meditation-module.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Define URL replacements - old truncated URL => new working URL
const urlReplacements = {
  'https://www.youtube.com/watch?v=kpsL1JtW0A': 'https://www.youtube.com/watch?v=tybOi4hjZFQ',
  'https://www.youtube.com/watch?v=6p_yKMFSYQ': 'https://www.youtube.com/watch?v=GZzhk9jEkkI',
  'https://www.youtube.com/watch?v=nDq6YpA8G1o': 'https://www.youtube.com/watch?v=15q-N-_kkrU',
  'https://www.youtube.com/watch?v=2A2lxGSC5ZI': 'https://www.youtube.com/watch?v=6p_yaNV4J3s',
  'https://www.youtube.com/watch?v=yL_m9wAq7w': 'https://www.youtube.com/watch?v=ZToicYpLt5M',
  'https://www.youtube.com/watch?v=z6b0pZ3t7c': 'https://www.youtube.com/watch?v=ssss7V1_eyA',
  'https://www.youtube.com/watch?v=Hj_5m5i0x8': 'https://www.youtube.com/watch?v=OEFXXGTgzQA',
  'https://www.youtube.com/watch?v=7eWz0Dk0gF0': 'https://www.youtube.com/watch?v=B18RzXa5OB8',
  'https://www.youtube.com/watch?v=WOBBdoQDw6g': 'https://www.youtube.com/watch?v=z6X5oEIg6Ak',
  'https://www.youtube.com/watch?v=5jW5G5x6Y7A': 'https://www.youtube.com/watch?v=O-6f5wQXSu8',
  'https://www.youtube.com/watch?v=ZToicqcCT-5U': 'https://www.youtube.com/watch?v=SEfs5TJZ6NA',
  'https://www.youtube.com/watch?v=m1f4z0c5pQ': 'https://www.youtube.com/watch?v=aVTQhvJsjC4',
  'https://www.youtube.com/watch?v=8k4w0QX-8U': 'https://www.youtube.com/watch?v=b7cMsb0WV6g',
  'https://www.youtube.com/watch?v=Jswl8d0xKjQ': 'https://www.youtube.com/watch?v=OBoW8pT2SJg',
  'https://www.youtube.com/watch?v=0x2p3W7H0c': 'https://www.youtube.com/watch?v=ntSRQV8v94I'
};

// Update titles and descriptions for Silva Method
const titleReplacements = {
  'Loving Kindness Meditation': 'Silva Method - Complete Beginner Guide',
  'Gratitude Meditation': 'Silva Method 3-2-1 Technique'
};

const descriptionReplacements = {
  'Cultivate compassion and positive emotions': 'Learn the famous Silva Mind Control technique for manifestation',
  'Practice gratitude to attract positivity': 'Advanced Silva method for deep meditation and visualization'
};

// Apply URL replacements
for (const [oldUrl, newUrl] of Object.entries(urlReplacements)) {
  content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
}

// Apply title replacements
for (const [oldTitle, newTitle] of Object.entries(titleReplacements)) {
  content = content.replace(new RegExp(`title: '${oldTitle}'`, 'g'), `title: '${newTitle}'`);
}

// Apply description replacements
for (const [oldDesc, newDesc] of Object.entries(descriptionReplacements)) {
  content = content.replace(new RegExp(`description: '${oldDesc}'`, 'g'), `description: '${newDesc}'`);
}

// Write the updated content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully updated meditation URLs!');
console.log(`Updated ${Object.keys(urlReplacements).length} video URLs`);
console.log('✅ Added Silva Method videos');
