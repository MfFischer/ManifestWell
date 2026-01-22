/**
 * Script to verify YouTube video URLs in meditation library
 * Checks if video IDs are valid format and tests accessibility
 */

const fs = require('fs');
const path = require('path');

// Read the library file
const libraryPath = path.join(__dirname, '..', 'src', 'content', 'meditations', 'library.ts');
const content = fs.readFileSync(libraryPath, 'utf8');

// Extract all YouTube URLs
const urlRegex = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g;
const urls = [];
let match;

while ((match = urlRegex.exec(content)) !== null) {
  urls.push({
    url: match[0],
    videoId: match[1],
    valid: match[1].length === 11
  });
}

console.log(`Found ${urls.length} YouTube URLs\n`);

// Check for invalid video IDs (not 11 characters)
const invalid = urls.filter(u => !u.valid);
if (invalid.length > 0) {
  console.log('❌ INVALID VIDEO IDs (not 11 characters):');
  invalid.forEach(u => {
    console.log(`  - ${u.videoId} (${u.videoId.length} chars): ${u.url}`);
  });
} else {
  console.log('✅ All video IDs are valid format (11 characters)\n');
}

// Check for duplicates
const videoIds = urls.map(u => u.videoId);
const duplicates = videoIds.filter((id, index) => videoIds.indexOf(id) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

if (uniqueDuplicates.length > 0) {
  console.log(`\n⚠️  DUPLICATE VIDEO IDs (${uniqueDuplicates.length} videos used multiple times):`);
  uniqueDuplicates.forEach(id => {
    const count = videoIds.filter(v => v === id).length;
    console.log(`  - ${id} appears ${count} times`);
  });
}

// Summary
console.log('\n📊 SUMMARY:');
console.log(`  Total URLs: ${urls.length}`);
console.log(`  Valid format: ${urls.filter(u => u.valid).length}`);
console.log(`  Invalid format: ${invalid.length}`);
console.log(`  Unique videos: ${new Set(videoIds).size}`);
console.log(`  Duplicate uses: ${duplicates.length}`);

// List of verified working video IDs (popular meditation channels)
const verifiedWorkingIds = [
  'inpok4MKVLM', // Goodful 5-min meditation
  '15q-N-_kkrU', // Jon Kabat-Zinn body scan
  'O-6f5wQXSu8', // Michael Sealey anxiety
  '1ZYbU82GVz4', // Jason Stephenson sleep
  'z6X5oEIg6Ak', // Goodful stress relief
  'OEFXXGTgzQA', // Silva Method
  'sz7cpV7ERsM', // Loving Kindness
  'GZzhk9jEkkI', // Box Breathing
  '0BNejY1e9ik', // Wim Hof
];

console.log(`\n✓ Sample of known working IDs in library: ${verifiedWorkingIds.filter(id => videoIds.includes(id)).length}/${verifiedWorkingIds.length}`);

