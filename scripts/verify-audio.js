const fs = require('fs');
const path = require('path');

// Extract tracks from source file (simplistic parsing for script)
// In a real build, we might import the module, but that requires TS setup in script
// We'll just scan the public/audio directory against expected structure

const PUBLIC_DIR = path.join(__dirname, '../public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');

// Expected minimum file set (Core tracks)
const CORE_TRACKS = [
    'ambient/rain-gentle.mp3',
    'ambient/ocean-waves.mp3',
    'meditation/peaceful-mind.mp3',
    'breathing/4-7-8-guide.mp3'
];

console.log('🔍 Verifying Audio Assets for "Offline First" Core...\n');

if (!fs.existsSync(AUDIO_DIR)) {
    console.error('❌ public/audio directory missing!');
    process.exit(1);
}

let missingCount = 0;

CORE_TRACKS.forEach(track => {
    const filePath = path.join(AUDIO_DIR, track);
    if (fs.existsSync(filePath)) {
        console.log(`✅ Found: ${track}`);
    } else {
        console.error(`❌ MISSING: ${track}`);
        missingCount++;
    }
});

console.log('\n--- Status Report ---');
if (missingCount > 0) {
    console.log(`⚠️  ${missingCount} core audio files are missing.`);
    console.log('   Please download royalty-free MP3s (e.g. from Pixabay) and place them in the folders above.');
    console.log('   See public/audio/README.md for details.');
    process.exit(1);
} else {
    console.log('✨ All core audio assets present. App is ready for offline bundling!');
    process.exit(0);
}
